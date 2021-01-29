import { getRegisteredSvgIcon, registerSvgIcon } from '../store.js'

const data =
`<?xml version="1.0" standalone="no"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
<svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
<path d="M512 128c211.74 0 384 172.26 384 384S723.74 896 512 896 128 723.74 128 512s172.26-384 384-384m0-64C264.58 64 64 264.58 64 512s200.58 448 448 448 448-200.58 448-448S759.42 64 512 64z" p-id="16258"></path><path d="M557.26 512l113.13-113.14a32 32 0 0 0-45.25-45.25L512 466.74 398.86 353.61a32 32 0 0 0-45.25 45.25L466.75 512 353.61 625.13a32 32 0 0 0 45.25 45.26L512 557.25l113.14 113.14a32 32 0 1 0 45.25-45.26z" p-id="16259"></path>
</svg>`

registerSvgIcon('error', data)

export default getRegisteredSvgIcon('error')
