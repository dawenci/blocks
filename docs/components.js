import routes from './routes.js'
import '../components/nav-menu/index.js'

window.onload = () => {
  const aside = document.querySelector('aside')
  const iframe = document.querySelector('iframe.article')

  // 导航
  const activeRoute = routes.find(route => route.url === decodeURIComponent(location.hash.slice(1))) ?? routes[0]
  const $menu = aside.appendChild(document.createElement('blocks-nav-menu'))
  const data = routes.map(route => {
    return {
      label: route.title,
      active: route === activeRoute,
      handler() {
        iframe.setAttribute('src', route.url)
        history.pushState({}, route.title, `#${encodeURIComponent(route.url)}`)
      }
    }
  })
  $menu.style.width = '100%'
  $menu.data = data

  iframe.setAttribute('src', activeRoute.url)
  document.title = activeRoute.title
}
