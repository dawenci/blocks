import { makeDomTemplate, makeTemplate } from '../../common/template.js'
import { range } from '../../common/utils.js'

export const _template = makeTemplate(/*html*/ `
<div id="layout">
  <bl-scrollable class="col" id="hours"></bl-scrollable>
  <bl-scrollable class="col" id="minutes"></bl-scrollable>
  <bl-scrollable class="col" id="seconds"></bl-scrollable>
</div>
`)

const _$dom = _template()
const _$bot = document.createElement('div')
_$bot.className = 'bot'
const _$item = document.createElement('div')
_$item.className = 'item'

const $hours = _$dom.querySelector('#hours')!
range(0, 23).forEach(n => {
  $hours.appendChild(_$item.cloneNode(true) as HTMLDivElement).textContent = n < 10 ? '0' + n : String(n)
})
$hours.appendChild(_$bot.cloneNode(true))

const $minutes = _$dom.querySelector('#minutes')!
range(0, 59).forEach(n => {
  $minutes.appendChild(_$item.cloneNode(true) as HTMLDivElement).textContent = n < 10 ? '0' + n : String(n)
})
$minutes.appendChild(_$bot.cloneNode(true))

const $seconds = _$dom.querySelector('#seconds')!
range(0, 59).forEach(n => {
  $seconds.appendChild(_$item.cloneNode(true) as HTMLDivElement).textContent = n < 10 ? '0' + n : String(n)
})
$seconds.appendChild(_$bot.cloneNode(true))

export const template = makeDomTemplate(_$dom)
