import '../select-result/index.js';
import '../popup/index.js';
import '../date/index.js';
import '../result/index.js';
import '../time/index.js';
import '../button/index.js';
import { makeTemplate } from '../../common/template.js';
export const contentTemplate = makeTemplate(`
<div id="content">
  <input id="from-date" part="from-date" readonly />
  <div id="separator">至</div>
  <input id="to-date" part="to-date" readonly />
</div>`);
export const popupTemplate = makeTemplate(`
<bl-popup append-to-body class="datetime-picker-popup" origin="top-start" arrow>
  <div id="panes" style="display:flex;flex-flow:row nowrap;">
    <div id="date-pane" style="flex:0 0 auto;">
      <bl-date class="date-picker-panel" mode="single"></bl-date>
    </div>

    <div id="time-pane" style="flex:0 0 auto;display:flex;flex-flow:column nowrap;border-left:1px solid rgba(0,0,0,.05);">
      <div id="time-value" style="flex:0 0 auto;display:flex;align-items:center;justify-content:center;"></div>
      <bl-time class="time-picker-panel"></bl-time>
    </div>
  </div>
  <div id="action" style="padding:5px;text-align:center;">
    <bl-button block type="primary" size="small">确定</bl-button>
  </div>
</bl-popup>
`);
