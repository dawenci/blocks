import { makeTemplate } from '../../common/template.js'

export const template = makeTemplate(/*html*/ `
<div part="layout" id="panes">
  <div part="layout-date" id="date-pane">
    <bl-date part="date" class="date-picker-panel" mode="single"></bl-date>
  </div>

  <div part="layout-time" id="time-pane" style="">
    <div part="time-value" id="time-value"></div>
    <bl-time part="time" class="time-picker-panel"></bl-time>
  </div>
</div>
`)
