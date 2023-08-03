import { __color_primary, __color_primary_shadow, __border_color_base, __transition_duration, } from '../../theme/var-light.js';
export const style = `
:host, :host * {
  box-sizing: border-box;
}
:host {
  all: initial;
  contain: content;
  box-sizing: border-box;
  display: inline-block;
  align-items: center;
  text-align: center;
  transition: color var(--bl-transition-duration, ${__transition_duration}), border-color var(--bl-transition-duration, ${__transition_duration});
  font-size: 0;
  width: 118px;
  height: auto;
  --focus-shadow: var(--bl-color-primary-shadow, ${__color_primary_shadow});
}
:host([vertical]) {
  height: 118px;
  width: auto;
}

#layout {
  box-sizing: border-box;
  position: relative;
  width: 100%;
  height: 18px;
  border-radius: 7px;
  cursor: default;
  border: 0 none;
  /* padding，容纳 shadow */
  padding: 2px;
  user-select: none;
}
:host([vertical]) #layout {
  height: 100%;
  width: 18px;
  transform: rotate(180deg);
}

/* 滑轨，button 的容器 */
#layout #track {
  box-sizing: border-box;
  display: block;
  position: relative;
  width: 100%;
  height: 100%;
}

/* 滑轨的背景，长或宽需要减去 button 的半径 */
#track__bg {
  pointer-events: none;
  box-sizing: border-box;
  display: block;
  position: absolute;
  width: auto;
  height: 4px;
  z-index: 0;
  top: 0;
  right: 7px;
  bottom: 0;
  left: 7px;
  margin: auto;
  background-color: rgba(0,0,0,.05);
  border-radius: 2px;
  overflow: hidden;
  transition: all var(--bl-transition-duration, ${__transition_duration});
}
:host([vertical]) #track__bg {
  width: 4px;
  height: auto;
  top: 7px;
  right: 0;
  bottom: 7px;
  left: 0;
}

:host(:not([disabled]):hover) #track__bg {
  background-color: rgba(0,0,0,.1);
}

/* 按钮 */
.point {
  box-sizing: border-box;
  overflow: hidden;
  display: block;
  position: absolute;
  top: 0;
  right: auto;
  bottom: 0;
  left: 0;
  z-index: 2;
  width: 14px;
  height: 14px;
  margin: auto 0;
  padding: 0;
  border-radius: 50%;
  border: 2px solid var(--bl-color-primary-base, ${__color_primary});
  background: #fff;
  transition: border-color var(--bl-transition-duration, ${__transition_duration});
}
:host([vertical]) .point {
  top: auto;
  right: 0;
  margin: 0 auto;
}

/* range 控制点之间连线 */
.line {
  position: absolute;
  z-index: 1;
  top: 5px;
  overflow: hidden;
  display: block;
  width: 4px;
  height: 4px;
  background: var(--bl-color-primary-base, ${__color_primary});
  pointer-events: none;
}
:host([vertical]) .line {
  top: auto;
  left: 5px;
}
:host([disabled]) .line {
  display: none;
}

.point:hover,
.point:focus,
.point.active {
  z-index: 3;
  border-color: var(--bl-color-primary-base, ${__color_primary});
  outline: 0 none;
  box-shadow: 0 0 0 2px var(--focus-shadow);
}

:host([disabled]) .point,
:host([disabled]) .point:hover,
:host([disabled]) .point:focus,
:host([disabled]) .point:active {
  border: 2px solid var(--bl-border-color-base, ${__border_color_base});
  box-shadow: none;
}
`;
