import { __height_base, __fg_base } from '../../theme/var-light.js';
import '../select-result/index.js';
import '../popup/index.js';
import '../date/index.js';
import '../result/index.js';
import '../time/index.js';
import '../button/index.js';
import { makeStyleTemplate, makeTemplate } from '../../common/template.js';
export const styleTemplate = makeStyleTemplate(`
:host(:focus),
:host(:focus-within),
:host(:hover) {
  --fg: var(--fg-base);
  --bg: var(--bg-base);
}

#content {
  height: calc(var(--height) - 2px);
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
}
input {
  box-sizing: border-box;
  border: 0;
  height: 100%;
  margin: 0;
  padding: 0;
  background: transparent;
  border-radius: var(--bl-radius-base);
  cursor: default;
  color: var(--bl-fg-base, ${__fg_base});
  height: var(--bl-height-base, ${__height_base});
  text-align: center;
}
:host([range]) input:hover {
  background-color: rgba(0, 0, 0, .025);
}
input:focus {
  outline: 0;
}
input.active {
  color: var(--bl-color-primary-base);
}
input::placeholder {
  text-align: center;
  color: var(--bl-fg-placeholder);
}

#from-date,
#to-date {
  width: 140px;
}
#from-date.active {
  background-image: linear-gradient(to right, transparent, var(--bl-bg-hover));
}
#to-date.active {
  background-image: linear-gradient(to left, transparent, var(--bl-bg-hover));
}
#separator {
  margin: auto 4px;
  color: var(--bl-fg-secondary);
}
:host(:not([range])) #separator,
:host(:not([range])) #from-date {
  display: none;
}

:host([range]) #from-date,
:host(:not([range])) #to-date {
  padding-left: 4px;
}
`);
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
