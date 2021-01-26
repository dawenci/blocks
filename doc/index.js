import routes from './routes.js'

window.onload = () => {
  const aside = document.querySelector('aside')
  const iframe = document.querySelector('iframe.article')

  routes.forEach(route => {
    const navItem = aside.appendChild(document.createElement('div'))
    navItem.textContent = route.title
    navItem.onclick = e => {
      iframe.setAttribute('src', route.url)
      history.pushState({}, route.title, `#${encodeURIComponent(route.url)}`)
    }
  })

  ;(() => {
    const route = routes.find(route => route.url === decodeURIComponent(location.hash.slice(1))) ?? routes[0]
    iframe.setAttribute('src', route.url)
    document.title = route.title
  })()
}
