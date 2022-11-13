import { getRegisteredSvgIcon, registerSvgIcon } from '../store.js'

const data = `<?xml version="1.0" standalone="no"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
<svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
<path d="M512 96c229.76 0 416 186.24 416 416s-186.24 416-416 416S96 741.76 96 512 282.24 96 512 96z m0 64a352 352 0 1 0 0 704 352 352 0 0 0 0-704z m241.066667 213.888l21.12 21.12a17.066667 17.066667 0 0 1 0 24.149333l-276.010667 276.010667a17.066667 17.066667 0 0 1-24.106667 0l-33.194666-33.194667v-0.042666L324.693333 546.133333a17.066667 17.066667 0 0 1-2.261333-21.461333l2.218667-2.688 21.077333-21.12a17.066667 17.066667 0 0 1 24.149333-0.042667l116.266667 115.797334 242.773333-242.773334a17.066667 17.066667 0 0 1 24.149334 0z" p-id="16124"></path>
</svg>`

registerSvgIcon('success', data)

export default getRegisteredSvgIcon('success')
