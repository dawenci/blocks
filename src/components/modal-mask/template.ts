import { makeStyleTemplate } from '../../common/template.js'

export const styleTemplate = makeStyleTemplate(/*css*/ `
:host {
  display: none;
  box-sizing: border-box;
  position: fixed;
  overflow: hidden;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: rgba(0,0,0,.3);
}
:host([open]) {
  display: block;
}
`)
