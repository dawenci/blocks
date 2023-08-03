import { __transition_duration } from '../../theme/var-light.js'

export const style = /*css*/ `
:host {
  display: inline-block;
  box-sizing: border-box;

  --size: 18px;
}

#layout {
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-end;
  align-items: center;
}
#layout:focus {
  outline: none;
}

button {
  position: relative;
  overflow: hidden;
  width: var(--size);
  height: var(--size);
  margin: 0 2px;
  padding: 0;
  border: 0;
  background: none;
  cursor: pointer;
  transition: all var(--bl-transition-duration, ${__transition_duration});
}
button:first-child {
  margin-left: 0;
}
button:last-child {
  margin-right: 0;
}
button:focus {
  outline: 0 none;
}

button > span {
  overflow: hidden;
  display: block;
  position: absolute;
  top: 0;
  right: auto;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
svg {
  position: absolute;
  z-index: 0;
  top: 0;
  right: auto;
  bottom: 0;
  left: 0;
  width: var(--size);
  height: var(--size);
  margin: auto;
}

button > .part {
  display: none;
  z-index: 1;
  width: 50%;
}
:host([half]) button .part,
:host([result-mode]) button .part {
  display: block;
}

button {
  fill: #f0f0f0;
}
:focus button {
  fill: #e0e0e0;
}
button.selected {
  fill: #fadb14;
}
button.partially-selected > .part {
  fill: #fadb14;
}
:host([result-mode]) button {
  cursor: default;
}
`
