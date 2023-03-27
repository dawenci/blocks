import { __height_base, __fg_base } from '../../theme/var-light.js'

export const style = /*css*/ `
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
input:hover {
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

#from {
  padding-left: 4px;
}
#from.active {
  background-image: linear-gradient(to right, transparent, var(--bl-bg-hover));
}
#to.active {
  background-image: linear-gradient(to left, transparent, var(--bl-bg-hover));
}
#separator {
  margin: auto 4px;
  color: var(--bl-fg-secondary);
}
`
