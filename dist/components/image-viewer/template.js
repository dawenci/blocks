import { makeStyleTemplate, makeTemplate } from '../../common/template.js';
import { __transition_duration } from '../../theme/var-light.js';
export const styleTemplate = makeStyleTemplate(`
:host {
  box-sizing: border-box;
  overflow: hidden;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 10;
}
::slotted(*) {
  display: none;
}
#layout {
  overflow: hidden;
  width: 100%;
  height: 100%;
  position: relative;
}
#content {
  overflow: hidden;
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}
#mask {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: rgba(0,0,0,.5);
}
#active {
  margin: 0;
  max-width: 100%;
  max-height: 100%;
  transition: transform var(--transition-duration, ${__transition_duration});
}

.button {
  overflow: hidden;
  position: relative;
  width: 44px;
  height: 44px;
  margin: 0;
  padding: 0;
  border: none;
  background: none;
  cursor: pointer;
}

.button:focus {
  outline: none;
}

.button[disabled] {
  cursor: default;
}

.button bl-icon {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: 20px;
  height: 20px;
  margin: auto;
  fill: #fff;
  opacity: .7;
  cursor: pointer;
}

.button:hover bl-icon {
  opacity: 1;
}

.button[disabled] bl-icon {
  opacity: .2;
  cursor: default;
}

#toolbar {
  position: absolute;
  top: 0;
  right: 0;
  bottom: auto;
  left: 0;
  width: 100%;
  height: 44px;
  background: rgba(0,0,0,.1);
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  justify-content: flex-end;
}

#prev,
#next {
  overflow: hidden;
  position: absolute;
  top: 0;
  bottom: 0;
  margin: auto;
  border-radius: 50%;
  background-color: rgba(0,0,0,.1);
  cursor: pointer;
}
#prev {
  left: 12px;
}
#next {
  right: 12px;
}
`);
export const contentTemplate = makeTemplate(`
<div id="layout" tabindex="0">
  <div id="content">
    <div id="mask"></div>
    <img id="active" />
  </div>
  <div id="thumbnails"></div>
  <div id="toolbar">
    <button class="button" id="rotate-left"><bl-icon value="rotate-left"></bl-icon></button>
    <button class="button" id="rotate-right"><bl-icon value="rotate-right"></bl-icon></button>
    <button class="button" id="zoom-out"><bl-icon value="zoom-out"></bl-icon></button>
    <button class="button" id="zoom-in"><bl-icon value="zoom-in"></bl-icon></button>
    <button class="button" id="close"><bl-icon value="cross"></bl-icon></button>
  </div>
  <button class="button" id="prev"><bl-icon value="left"></bl-icon></button>
  <button class="button" id="next"><bl-icon value="right"></bl-icon></button>
  <slot></slot>
</div>
`);
