import { getRegisteredSvgIcon, registerSvgIcon } from '../store.js'

const data =
`<?xml version="1.0" standalone="no"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
<svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M512 427.90679347a84.09320653 84.09320653 0 1 1 0 168.18641306 84.09320653 84.09320653 0 0 1 0-168.18641306z m310.68918518 0a84.09320653 84.09320653 0 1 1 0 168.18641306 84.09320653 84.09320653 0 0 1 0-168.18641306z m-621.37837036 0a84.09320653 84.09320653 0 1 1 0 168.18641306 84.09320653 84.09320653 0 0 1 0-168.18641306z" p-id="1308"></path></svg>`

registerSvgIcon('more', data)

export default getRegisteredSvgIcon('more')
