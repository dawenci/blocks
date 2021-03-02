// 对于现代浏览器，优先使用 ResizeObserver
// 
// 否则使用滚动检测，原理：
//
// 一、尺寸变大检测
// 1. 检测目标（必须有定位属性，能作为 offsetParent）内部放一个绝对定位，四个方向为零（为了跟检测目标的内部尺寸一致）的元素 expand。
// 2. 元素 expand 里面再放置一个 expandChild 元素（不设置 css 尺寸，每次动态计算设置）。
// 3. 设置 expandChild 的尺寸为 expand 的尺寸再加上 1px，并设置其滚动位置为滚到尽头的状态（即 expand 的 offsetTop/offsetLeft 都是 1px）。
// 4. 每当检测目标尺寸变大，会导致 expand 也变大到足以容纳 expandChild（尺寸不变），从而让 offsetTop/offsetLeft 变成 0，从而触发滚动事件
// 5. 手工通知尺寸变化。
// 6. 尺寸变化事件处理中，重复第 3 步之后的逻辑，为下次滚动检测做准备。
//
// 二、尺寸变小检测
// 1. 检测目标里面放置一个 shrink 元素，设置一个 top 和 left 50%，bottom、right 0 的元素，即尺寸永远是检测目标的一半。
// 2. shrink 里面放一个 shrinkChild 元素，css 设置尺寸 200% 以上，即尺寸永远是 shrink 的两倍以上，永远处于滚动状态。
// 3. 设置 shrinkChild 的滚动位置，让其处于滚动尽头的状态，（即 shrink 的 offsetTop/offsetLeft 都是 shrink 的尺寸）
// 4. 每当检测目标尺寸变小，会导致 shrink 变小，同时 shrinkChild 也变小，但是变小的速率不一样，从而让 offsetTop/offsetLeft 变小，触发滚动事件。
// 5. 手工通知尺寸变化。
// 6. 尺寸变化事件处理中，重复第 3 步之后的逻辑，为下次滚动检测作准备。
//
// 注, 不同浏览器均有尺寸上限的制约。我们需要让 shrinkChild 的尺寸两倍以上，为了不溢出，将 shrink 设置 50% 的尺寸。
//
// 方案参考：
// https://blog.crimx.com/2017/07/15/element-onresize/
// https://github.com/WICG/EventListenerOptions/blob/gh-pages/explainer.md

/**
 * 检测元素的尺寸变化
 *
 * @export
 * @param {HTMLElement} el 被检测的元素，必须设置了定位属性
 * @param {(size: { width: number, height: number }) => void} handler 回调函数
 * @returns {() => void} 返回一个清理方法
 */
export const sizeObserve = (() => {
  if (window.ResizeObserver) {
    return function sizeObserve(el, handler) {
      const observer = new ResizeObserver(entries => {
        const len = entries.length
        for (let i = 0; i < len; i += 1) {
          const entry = entries[i]
          if (entry.target === el) {
            handler({ width: Math.ceil(entry.contentRect.width), height: Math.ceil(entry.contentRect.height) })
          }
        }
      })
      observer.observe(el)
      // 返回一个销毁方法
      return function() {
        observer.disconnect()
      }
    }
  }

  // scroll passive events
  let passiveEvents = false
  try {
    const opts = Object.defineProperty({}, 'passive', {
      get: function() {
        passiveEvents = { passive: true }
      }
    })
    window.addEventListener('test', null, opts)
  } catch (e) {
    /* */
  }

  return function sizeObserve(el, handler) {
    if (getComputedStyle(el).position === 'static') el.style.position = 'relative'

    const expand = document.createElement('div')
    // 因为元素的尺寸在不同的浏览中都有限制
    // top, left 偏移 1px， child 永远大 1px 形成滚动状态
    expand.style.cssText =
      'position:absolute;top:1px;bottom:0;left:1px;right:0;z-index=-1;overflow:hidden;visibility:hidden;pointer-events:none;max-width:100%;max-height:100%;'

    // 因为元素的尺寸在不同的浏览中都有限制
    // 所以将 top, left 设置为 50%，这样 expand、shrink 的尺寸就是元素的一半
    // 进而，shrinkChild 的尺寸为 200% 也只是跟元素一样大，而不会有问题
    const shrink = expand.cloneNode(false)
    shrink.style.cssText =
      'position:absolute;top:50%;bottom:0;left:50%;right:0;z-index=-1;overflow:hidden;visibility:hidden;pointer-events:none;max-width:100%;max-height:100%;'

    const expandChild = document.createElement('div')
    expandChild.style.cssText = 'position:absolute;top:0;left:0;transition:0s;animation:none;'

    const shrinkChild = expandChild.cloneNode(false)
    shrinkChild.style.width = 'calc(200% + 1px)'
    shrinkChild.style.height = 'calc(200% + 1px)'

    expand.appendChild(expandChild)
    shrink.appendChild(shrinkChild)
    el.appendChild(expand)
    el.appendChild(shrink)

    let dirty = false
    // last request animation frame id used in onscroll event
    let rafId = 0
    let lastWidth = 0
    let lastHeight = 0
    let initialHiddenCheck = true
    let lastAnimationFrameForInvisibleCheck = 0

    const size = {
      width: el.clientWidth,
      height: el.clientHeight,
    }

    function resetExpandShrink() {
      // 获取外容器的最新尺寸
      const width = expand.clientWidth
      const height = expand.clientHeight

      // expandChild 永远比 expand 大 1px，以形成滚动状态
      expandChild.style.width = width + 1 + 'px'
      expandChild.style.height = height + 1 + 'px'
      // expand 永远滚动底部（右下角），即左上角滚出视口的值为 1px
      // 这样下次元素尺寸变大，会导致滚出去的部分小于 px，从而触发滚动事件
      expand.scrollLeft = width || 1
      expand.scrollTop = height || 1

      // shrink 的尺寸永远是容器的两倍，滚动处于 50% 的状态
      shrink.scrollLeft = width + 1
      shrink.scrollTop = height + 1
    }

    function reset() {
      // Check if element is hidden
      if (initialHiddenCheck) {
        var invisible = el.offsetWidth === 0 && el.offsetHeight === 0
        if (invisible) {
          // Check in next frame
          if (!lastAnimationFrameForInvisibleCheck) {
            lastAnimationFrameForInvisibleCheck = requestAnimationFrame(function() {
              lastAnimationFrameForInvisibleCheck = 0
              reset()
            })
          }
          return
        }
        else {
          // Stop checking
          initialHiddenCheck = false
        }
      }
      resetExpandShrink()
    }

    function onScroll() {
      if (!rafId) {
        rafId = requestAnimationFrame(onResized)
      }
      reset()
    }

    function onResized() {
      rafId = 0

      size.width = el.clientWidth
      size.height = el.clientHeight
      dirty = size.width !== lastWidth || size.height !== lastHeight

      if (!dirty) return

      lastWidth = size.width
      lastHeight = size.height

      handler(size)
    }

    expand.addEventListener('scroll', onScroll, passiveEvents)
    shrink.addEventListener('scroll', onScroll, passiveEvents)

    // Fix for custom Elements and invisible elements
    lastAnimationFrameForInvisibleCheck = requestAnimationFrame(function() {
      lastAnimationFrameForInvisibleCheck = 0
      reset()
    })

    // 返回一个销毁方法
    return function() {
      expand.removeEventListener('scroll', onScroll)
      shrink.removeEventListener('scroll', onScroll)
      el.removeChild(expand)
      el.removeChild(shrink)
    }
  }
})()
