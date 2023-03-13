export const style = `
/* <component>steps */
:host {
  display: block;
  box-sizing: border-box;
}
#layout {
  display: flex;
}
:host(:not([direction="vertical"])) #layout,
:host([direction="horizontal"]) #layout {
  flex-flow: row nowrap;
}
:host([direction="vertical"]) #layout {
  flex-flow: column nowrap;
}
`;
