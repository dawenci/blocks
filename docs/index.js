import routes from './routes.js'
import '../dist/components/scrollable/index.js'
import '../dist/components/nav-menu/index.js'

const pageTitle = route => {
  return `${route.category} > ${route.title} - blocksUI web components`
}

window.onload = () => {
  const $header = document.getElementById('header')
  const $aside = document.getElementById('aside')
  const $iframe = document.getElementById('article')
  const $mask = document.getElementById('mask')

  // 当前激活的路由
  let activeRoute =
    routes.find(route => {
      const hash = location.hash.slice(1)
      const category = hash.split('/')[0] ?? ''
      const url = hash.slice(category.length + 1)
      return route.url === url
    }) ?? routes[0]

  // 当前激活的分类
  let activeCategory = activeRoute.category

  // 页面跳转方法
  const gotoRoute = route => {
    activeRoute = route
    activeCategory = route.category
    $iframe.setAttribute('src', route.url)
    document.title = pageTitle(route)
    history.pushState({}, route.title, `#${route.category}/${route.url}`)
  }

  // 生成侧导航数据
  const generateSideNavData = () => {
    return routes
      .filter(route => route.category === activeCategory)
      .map(route => {
        return {
          label: route.title,
          active: route === activeRoute,
          handler() {
            gotoRoute(route)
          },
        }
      })
  }

  // 侧导航
  const $scrollable = $aside.appendChild(document.createElement('bl-scrollable'))
  // 拉动滚动条的时候，显示遮罩覆盖 iframe，以免鼠标拖拽过程移到右侧时，move 事件被 iframe 捕获导致无法拉动滚动条
  $scrollable.addEventListener('drag-scroll-start', () => {
    $mask.style.display = 'block'
  })
  $scrollable.addEventListener('drag-scroll-end', () => {
    $mask.style.display = 'none'
  })
  const $sideMenu = $scrollable.appendChild(document.createElement('bl-nav-menu'))
  $sideMenu.style.width = '100%'
  $sideMenu.size = 'large'
  $sideMenu.data = generateSideNavData()

  // 顶导航
  const $headerMenu = $header.appendChild(document.createElement('bl-nav-menu'))
  $headerMenu.horizontal = true
  $headerMenu.setAttribute('blocks-theme', 'dark')
  $headerMenu.size = 'large'
  const headerNavData = []
  routes.forEach(route => {
    if (headerNavData.find(item => item.label === route.category)) {
      return
    }
    headerNavData.push({
      label: route.category,
      active: route.category === activeCategory,
      handler() {
        gotoRoute(route)
        // 分类切换，重新生成侧导航
        $sideMenu.data = generateSideNavData()
      },
    })
  })
  $headerMenu.data = headerNavData

  // 初始化加载页面
  $iframe.setAttribute('src', activeRoute.url)
  document.title = pageTitle(activeRoute)
}
