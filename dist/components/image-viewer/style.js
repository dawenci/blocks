import { __transition_duration } from '../../theme/var-light.js';
export const style = `
/* <component>image-viewer */
:host {
  --mask-bg: rgba(0,0,0,.75);
}
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
  background: var(--mask-bg);
}
#active {
  margin: 0;
  max-width: 100%;
  max-height: 100%;
  transition: transform var(--bl-transition-duration, ${__transition_duration});
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
`;
