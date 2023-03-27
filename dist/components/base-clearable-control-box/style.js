export const style = `
/* <component>base-clearable-control-box */
:host([clearable]:hover) #layout:not(.empty) #suffix {
opacity: 0;
pointer-events: none;
}
:host([clearable]:hover) #layout:not(.empty) #clear {
opacity: var(--icon-opacity);
pointer-events: auto;
}

.with-clear {
padding-right: var(--padding);
}
#clear {
box-sizing: border-box;
flex: 0 0 auto;
position: relative;
display: block;
width: var(--icon-size);
height: var(--icon-size);
border: 1px solid var(--fg);
border-radius: 50%;
background-color: transparent;
opacity: 0;
pointer-events: none;
transform: rotate(45deg);
transition: all var(--duration);
}
#clear::before,
#clear::after {
display: block;
content: '';
position: absolute;
top: 0;
right: 0;
bottom: 0;
left: 0;
width: 2px;
height: 2px;
background: var(--fg);
margin: auto;
}
#clear::before {
width: 8px;
}
#clear::after {
height: 8px;
}
:host([clearable]:hover) #layout:not(.empty) #clear:hover {
opacity: var(--icon-opacity-hover);
border-color: var(--fg);
}
#clear:hover::before,
#clear:hover::after {
background-color: var(--fg);
}
:host([clearable]:hover) #layout:not(.empty) #clear:active {
opacity: var(--icon-opacity-active);
}
#clear:focus {
outline: 0 none;
}
.with-suffix #clear {
position: absolute;
top: 0;
right: var(--padding);
bottom: 0;
left: auto;
margin: auto;
}
`;
