export function onTransition($el, { run, start, cancel, end } = {}) {
  // transition 的属性可能有多个，避免重复触发，只跟踪一个属性
  let prop = ''

  // 过渡开始执行（transition-delay 之前就开始算）
  $el.ontransitionrun = (ev) => {
    if (ev.target !== $el) return
    if (!prop) prop = ev.propertyName
    if (run) run(ev)
  }

  // 过渡真正开始时（transition-delay 后，动画开始执行才算）
  $el.ontransitionstart = (ev) => {
    if (ev.target !== $el || ev.propertyName !== prop) return
    if (start) start(ev)
  }    

  // 过渡取消时
  $el.onontransitioncancel = (ev) => {
    if (ev.target !== $el || ev.propertyName !== prop) return
    if (cancel) cancel(ev)
  }

  // 过渡结束时
  $el.ontransitionend = (ev) => {
    if (ev.target !== $el || ev.propertyName !== prop) return
    prop = ''
    if (end) end()
  }
}
