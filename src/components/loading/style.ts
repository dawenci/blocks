import { __color_primary } from '../../theme/var-light.js'

export const style = /*css*/ `
@keyframes rotate360 {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
:host {
  box-sizing: border-box;
  position: absolute;  
  display: inline-block;
  width: 32px;
  height: 32px;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  margin: auto;
}
#layout {
  box-sizing: border-box;
  display: inline-block;
  position: relative;
  width: 100%;
  height: 100%;
}
#layout svg {
  box-sizing: border-box;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
  margin: auto;
  animation: 1s linear infinite rotate360;
  fill: var(--bl-color-primary-base, ${__color_primary});
  pointer-events: none;
}
`
