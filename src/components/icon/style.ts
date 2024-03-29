export const style = /*css*/ `
:host {
  display: inline-block;
  box-sizing: border-box;
  overflow: hidden;
  user-select: none;
  cursor: default;
  width: 32px;
  height: 32px;
}
:host(:focus) {
  outline: 0 none;
}
#layout {
  width: 100%;
  height: 100%;
}
#layout svg {
  display: block;
  width: 100%;
  height: 100%;
}
`
