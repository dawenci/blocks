import { getRegisteredSvgIcon, registerSvgIcon } from '../store.js'

const data =
`<?xml version="1.0" standalone="no"?>
<svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="200" height="200"><path d="M672 418.016H144c-17.696 0-32 14.272-32 32V864c0 17.696 14.304 32 32 32H672c17.696 0 32-14.304 32-32V449.984c0-17.696-14.304-32-32-32z m-44 401.984H188V493.984h440v326.016z m191.296-491.52a400.992 400.992 0 0 0-314.592-154.176l-0.192-64a7.808 7.808 0 0 0-12.608-6.08l-128 100.96a7.872 7.872 0 0 0 0 12.32l128.096 101.12c5.12 3.968 12.704 0.384 12.608-6.112V248.608c12.896 0.096 25.92 0.896 38.784 2.496a326.08 326.08 0 0 1 119.008 38.72 327.328 327.328 0 0 1 98.4 84.288 325.696 325.696 0 0 1 64.608 256.672h74.88a398.528 398.528 0 0 0-80.96-302.272z" p-id="11609"></path></svg>
`

registerSvgIcon('rotate-left', data)

export default getRegisteredSvgIcon('rotate-left')
