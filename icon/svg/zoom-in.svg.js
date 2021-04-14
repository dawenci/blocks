import { getRegisteredSvgIcon, registerSvgIcon } from '../store.js'

const data =
`<?xml version="1.0" standalone="no"?>
<svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="200" height="200"><path d="M636.8 443.2H519.2V308.8c0-4-3.2-8-8-8h-60c-4.8 0-8 4-8 8v134.4H324.8c-4 0-8 3.2-8 8v60c0 4.8 4 8 8 8h118.4v134.4c0 4.8 3.2 8 8 8h60c4.8 0 8-3.2 8-8V519.2h118.4c4.8 0 8-3.2 8-8v-60c-0.8-4.8-4-8-8.8-8z m284 424L775.2 720.8c122.4-148.8 113.6-369.6-25.6-508.8C600.8 64 360.8 64 212 212 64 360.8 64 600.8 212 748.8c139.2 139.2 360 148 508.8 25.6l145.6 145.6c3.2 3.2 8 3.2 11.2 0l43.2-43.2c3.2-1.6 3.2-6.4 0-9.6zM696 696c-119.2 118.4-311.2 118.4-430.4 0-118.4-119.2-118.4-311.2 0-430.4C384 147.2 576.8 147.2 696 265.6c118.4 119.2 118.4 311.2 0 430.4z" p-id="11994"></path></svg>`

registerSvgIcon('zoom-in', data)

export default getRegisteredSvgIcon('zoom-in')
