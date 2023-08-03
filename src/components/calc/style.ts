import {
  __bg_base,
  __bg_header,
  __border_color_base,
  __color_primary,
  __fg_base,
  __font_family,
  __height_base,
  __radius_base,
} from '../../theme/var-light.js'

export const style = /*css*/ `
:host {
  box-sizing: border-box;
  display: inline-block;
  vertical-align: top;
  background-color: var(--bl-bg-base, ${__bg_base});
  color: var(--bl-fg-base, ${__fg_base});
  width: calc(var(--bl-height-base, ${__height_base}) * 6 + 8px);
  height: calc(var(--bl-height-base, ${__height_base}) * 7.5 + 8px);
  padding: 4px;
  border: 1px solid var(--bl-border-color-base, ${__border_color_base});
  border-radius: var(--bl-radius-base, ${__radius_base});
  font-family: var(--bl-font-family, ${__font_family});
}

#layout {
  box-sizing: border-box;
  display: flex;
  flex-flow: column nowrap;
  width: 100%;
  height: 100%;
  border-radius: var(--bl-radius-base, ${__radius_base});
  font-family: Arial, Helvetica, sans-serif;
}
#layout:focus {
  outline: none;
}
#layout * {
  box-sizing: border-box;
}

.Calc-screen {
  flex: 0 0 auto;
  overflow: hidden;
  position: relative;
  width: 100%;
  margin-bottom: 1px;
  padding: 0 8px;
  border-radius: var(--bl-radius-base, ${__radius_base});
  height: calc(var(--bl-height-base, ${__height_base}) * 1.5);
  line-height: calc(var(--bl-height-base, ${__height_base}) * 1.5);
  background-color: var(--bl-bg-header, ${__bg_header});
}
.Calc-screen-result {
  position: relative;
  width: 100%;
  height: 100%;
  text-align: right;
}
.Calc-screen-input {
  position: absolute;
  right: 0;
  top: 0;
  text-align: right;
  font-size: 1.5em;
  transform-origin: right;
}
.Calc-screen-cursor {
  display: block;
  position: absolute;
  top: 0;
  right: 0;
}

.Calc-keyboard {
  flex: 1 1 100%;
  overflow: hidden;
  width: 100%;
  border-radius: var(--bl-radius-base, ${__radius_base});
  font-size: 14px;
}

.Calc-keyboard-area {
  overflow: hidden;
}
.Calc-keyboard-key {
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  float: left;
  vertical-align: top;
  position: relative;
  z-index: 0;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  margin: 0;
  padding: 0;
  border: 1px solid transparent;
  text-align: center;
  cursor: pointer;
  user-select: none;
  transition: 0.2s all;
}

.Calc-keyboard-key:hover,
.Calc-keyboard-key:focus {
  z-index: 1;
  outline: none;
  background-color: var(--bl-bg-hover);
  border-color: var(--bl-border-color-hover);
}

.Calc-keyboard-key.active {
  color: var(--bl-color-primary-base, ${__color_primary});
}

.Calc-keyboard-memory {
  width: 100%;
  height: 16.6666%;
  font-size: 12px;
}
.Calc-keyboard-memory .Calc-keyboard-key {
  width: 25%;
  height: 100%;
  font-size: 12px;
}

.Calc-keyboard-group {
  float: left;
  width: 75%;
  height: 83.3333%;
}
.Calc-keyboard-actions {
  width: 100%;
  height: 20%;
}
.Calc-keyboard-actions .Calc-keyboard-key {
  width: 33.3333%;
  height: 100%;
  font-size: 12px;
}

.Calc-keyboard-numbers {
  width: 100%;
  height: 80%;
}
.Calc-keyboard-numbers .Calc-keyboard-key {
  width: 33.3333%;
  height: 25%;
}

.Calc-keyboard-operators {
  float: left;
  width: 25%;
  height: 83.3333%;
}
.Calc-keyboard-operators .Calc-keyboard-key {
  width: 100%;
  height: 20%;
  font-size: 16px;
}
`
