import { getRegisteredSvgIcon, registerSvgIcon } from '../store.js'

const data = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1026 1024" width="200" height="200">
  <path d="M304.03597387 153.49667307c-16.12124267 17.73336694-14.5091184 45.13947875 1.61212427 61.26072073L624.84869652 511.3882539 305.64809815 808.01911328c-17.73336694 16.12124267-17.73336694 43.5273545-1.61212428 61.26072069 16.12124267 17.73336694 43.5273545 17.73336694 61.2607207 1.61212426L718.35190184 543.63073851c8.06062132-8.06062132 14.5091184-19.34549047 14.50911843-32.24248462 0-11.28486987-4.83637281-24.18186328-14.5091184-32.24248462l-353.0552073-327.26121972C347.56332763 135.76330687 320.15721582 135.76330687 304.03597387 153.49667307z" p-id="1602"></path>
</svg>`

registerSvgIcon('right', data)

export default getRegisteredSvgIcon('right')
