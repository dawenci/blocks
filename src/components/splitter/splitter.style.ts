import { __border_color_base, __color_primary_light } from '../../theme/var-light.js'

export const style = /*css*/ `
/* <component>splitter */
:host {
  display: block;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  border: 1px solid var(--bl-border-color-base, ${__border_color_base});
}
#layout {
  overflow: hidden;
  position: relative;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
#panes {
  position: relative;
  z-index: 0;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
#cover {
  display: none;
  position: absolute;
  z-index: 1;
  width: 100%;
  height: 100%;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
}
:host(:not([direction])) #cover,
:host([direction="horizontal"]) #cover {
  cursor: col-resize;
}
:host([direction="vertical"]) #cover {
  cursor: row-resize;
}

:host(:not([direction])) #layout,
:host([direction="horizontal"]) #layout {
  flex-direction: row;
}
:host([direction="vertical"]) #layout {
  flex-direction: column;
}

.handle {
  box-sizing: border-box;
  position: absolute;
  display: block;
  user-select: none;
}
.handle.active,
.handle:hover,
.handle.dragging {
  z-index: 1;
}
.handle::before {
  position: absolute;
  content: '';
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  margin: auto;
  width: 100%;
  height: 100%;
}
.handle::after {
  position: absolute;
  content: '';
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  margin: auto;
  width: 1px;
  height: 1px;
}
.handle:hover::before,
.handle.dragging::before {
  background-color: var(--bl-color-primary-hover, ${__color_primary_light});
  opacity: .5;
}
.handle:hover::after,
.handle.dragging::after {
  background-color: var(--bl-color-primary-hover, ${__color_primary_light});
}

:host(:not([direction])) .handle,
:host([direction="horizontal"]) .handle {
  top: 0;
  right: auto;
  bottom: auto;
  left: 0;
  height: 100%;
  border-top: 0;
  border-bottom: 0;
  cursor: col-resize;
}
:host(:not([direction])) .handle::after,
:host([direction="horizontal"]) .handle::after {
  height: 100%;
}
:host([direction="vertical"]) .handle {
  top: 0;
  right: auto;
  bottom: auto;
  left: 0;
  width: 100%;
  border-left: 0;
  border-right: 0;
  cursor: row-resize;
}
:host([direction="vertical"]) .handle::after {
  width: 100%;
}
`
