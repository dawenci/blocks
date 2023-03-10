import { makeTemplate } from '../../common/template.js'

export const itemTemplate = makeTemplate(/*html*/ `
<div class="item">
  <bl-progress class="progress"></bl-progress>
  <div class="type"></div>
  <div class="name">名称</div>
  <div class="size">10k</div>
</div>
`)
