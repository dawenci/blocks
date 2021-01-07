import { getIconSvg, register } from '../icon.js'

const data =
`<?xml version="1.0" standalone="no"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
<svg viewBox="0 0 1026 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
  <path d="M153.49667307 719.96402613c17.73336695 16.12124267 45.13947875 14.5091184 61.26072073-1.61212427L511.3882539 399.15130348 808.01911328 718.35190185c16.12124267 17.73336695 43.5273545 17.73336695 61.26072069 1.61212428 17.73336695-16.12124267 17.73336695-43.5273545 1.61212426-61.2607207L543.63073851 305.64809816c-8.06062132-8.06062132-19.34549048-14.5091184-32.24248462-14.50911843-11.28486987 0-24.18186328 4.83637281-32.24248462 14.50911841l-327.26121972 353.05520729C135.76330687 676.43667237 135.76330687 703.84278419 153.49667307 719.96402613z" p-id="1007"></path>
</svg>`

register('up', { data })

export default getIconSvg('up')
