import { getRegisteredSvgIcon, registerSvgIcon } from '../store.js'

const data = `<?xml version="1.0" standalone="no"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
<svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
<path d="M512 64C264.576 64 64 264.577 64 512s200.576 448 448 448 448-200.576 448-448S759.423 64 512 64z m0 832c-212.077 0-384-171.923-384-384s171.923-384 384-384 384 171.923 384 384-171.923 384-384 384z" p-id="16393"></path><path d="M512 448c-17.673 0-32 14.327-32 32v256c0 17.673 14.327 32 32 32s32-14.327 32-32V480c0-17.673-14.327-32-32-32z" p-id="16394"></path><path d="M512 336m-48 0a48 48 0 1 0 96 0 48 48 0 1 0-96 0Z" p-id="16395"></path>
</svg>`

registerSvgIcon('info', data)

export default getRegisteredSvgIcon('info')
