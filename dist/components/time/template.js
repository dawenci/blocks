import { makeTemplate } from '../../common/template.js';
export const template = makeTemplate(`
<div id="layout">
  <bl-scrollable class="col" id="hours"></bl-scrollable>
  <bl-scrollable class="col" id="minutes"></bl-scrollable>
  <bl-scrollable class="col" id="seconds"></bl-scrollable>
</div>
`);
