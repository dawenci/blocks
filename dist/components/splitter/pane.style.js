export const style = `
:host {
  display: block;
  position: absolute;
  box-sizing: border-box;
}
:host(.horizontal) {
  height: 100%;
  width: auto;
}
:host(.vertical) {
  width: 100%;
  height: auto;
}
#content {
  position: relative;
  z-index: 1;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
}
`;
