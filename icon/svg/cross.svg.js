import { getRegisteredSvgIcon, registerSvgIcon } from '../store.js'

const data =
`<?xml version="1.0" standalone="no"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
<svg viewBox="0 0 1026 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
  <path d="M557.26 512l248.89-248.91a32 32 0 1 0-45.25-45.25L512 466.75 263.1 217.84a32 32 0 0 0-45.26 45.25L466.74 512l-248.9 248.9a32 32 0 0 0 45.26 45.25L512 557.25l248.9 248.9a32 32 0 0 0 45.25-45.25z" p-id="940"></path>
</svg>`

registerSvgIcon('cross', data)

export default getRegisteredSvgIcon('cross')
