import { __fg_base, __height_base } from '../../theme/var-light.js'

export const style = /*css*/ `
[part="content"] {
  height: calc(var(--height) - 2px);
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
}
[part="first"], [part="second"] {
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
[part="first"]:focus, [part="second"]:focus {
  outline: 0;
}
[part="first"]:active, [part="second"]:active {
  color: var(--bl-color-primary-base);
}
[part="first"]::placeholder, [part="second"]::placeholder {
  text-align: center;
  color: var(--bl-fg-placeholder);
}

[part="first"], [part="second"] {
  flex: 1 1 50%;
  width: 50%;
}
[part="first"] {
  padding-left: 4px;
}
[part="separator"] {
  flex: 0 0 auto;
  margin: auto 4px;
  color: var(--bl-fg-secondary);
}
`
