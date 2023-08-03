import { __height_base } from '../../theme/var-light.js'

export const style = /*css*/ `
:host {
  display: inline-block;
}

[part="layout"] {
  display: inline-flex;
  flex-flow: row nowrap;
  vertical-align: top;
}

[part="layout-date"] {
  flex: 0 0 auto;
  display: block;
}
[part="date"] {
  display: block;
}

[part="layout-time"] {
  flex: 0 0 auto;
  display: block;
  border-left: 1px solid rgba(0,0,0,.05);
  height: calc(var(--bl-height-base, ${__height_base}) * 8 + 10px);
}
[part="time-value"] {
  display: flex;
  height: calc(var(--bl-height-base, ${__height_base}) - 1px);
  align-items: center;
  justify-content: center;
}
[part="time"] {
  display: block;
  height: calc(100% - var(--bl-height-base, ${__height_base}))
}

`
