import {
  makeDomTemplate,
  makeFragmentTemplate,
  makeStyleTemplate,
} from '../../common/template.js'
import { __fg_secondary, __font_family } from '../../theme/var-light.js'

export const styleTemplate = makeStyleTemplate(/*css*/ `
:host {
  display: block;
  margin: 10px 0;
  font-family: var(--font-family, ${__font_family});
  font-size: 14px;
}
#head {
  margin: 5px 10px;
  padding: 5px 0;
  font-weight: 500;
  font-size: 12px;
  color: var(--bl-fg-secondary, ${__fg_secondary});
  cursor: default;
}
`)

export const contentTemplate = makeFragmentTemplate(/*html*/ `
<div id="head"></div><div id="body"><slot></slot></div>
`)

export const itemTemplate = makeDomTemplate(
  document.createElement('bl-popup-menu-item')
)
