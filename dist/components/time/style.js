import { __color_primary, __fg_disabled, __height_base, __height_large, __height_small } from '../../theme/var-light.js';
export const style = `
:host {
  display: inline-block;
  vertical-align: top;
  width: calc(var(--bl-height-base, ${__height_base}) * 3 + 12px * 3);
  height: calc(var(--bl-height-base, ${__height_base}) * 8 + 10px);
  background: #fff;
  user-select: none;
  font-size: 14px;
}
:host([size="small"]) {
  width: calc(var(--bl-height-small, ${__height_small}) * 3 + 12px * 3);
  height: calc(var(--bl-height-small, ${__height_small}) * 8 + 10px);
  font-size: 12px;
}
:host([size="large"]) {
  width: calc(var(--bl-height-large, ${__height_large}) * 3 + 12px * 3);
  height: calc(var(--bl-height-large, ${__height_large}) * 8 + 10px);
}

#layout {
  position: relative;
  overflow: hidden;
  width: 100%;
  height: 100%;
}
#layout:after {
  position: absolute;
  top: var(--bl-height-base, ${__height_base});
  left: 5px;
  right: 5px;
  display: block;
  content: '';
  height: 1px;
  background-color: rgba(0,0,0,.05);
}
:host([size="small"]) #layout:after {
  top: var(--bl-height-small, ${__height_small});
}
:host([size="large"]) #layout:after {
  top: var(--bl-height-large, ${__height_large});
}

.col {
  position: relative;
  box-sizing: border-box;
  overflow: hidden;
  float: left;
  width: calc(var(--bl-height-base, ${__height_base}) + 12px);
  height: 100%;
  margin: 0;
  padding: 0;
}
:host([size="small"]) .col {
  width: calc(var(--bl-height-small, ${__height_small}) + 12px);
}
:host([size="large"]) .col {
  width: calc(var(--bl-height-large, ${__height_large}) + 12px);
}

#layout > .col:hover {
  background: rgba(0,0,0,.025);
}
#layout > .col:after {
  display: block;
  content: '';
  height: calc(100% - var(--bl-height-base, ${__height_base}));
}
:host([size="small"]) #layout > .col:after {
  height: calc(100% - var(--bl-height-small, ${__height_small}));
}
:host([size="large"]) #layout > .col:after {
  height: calc(100% - var(--bl-height-large, ${__height_large}));
}

#hours {}
#minutes {}
#seconds {}
.item {
  height: var(--bl-height-base, ${__height_base});
  line-height: var(--bl-height-base, ${__height_base});
  text-align: center;
  cursor: default;
}
:host([size="small"]) .item {
  height: var(--bl-height-small, ${__height_small});
  line-height: var(--bl-height-small, ${__height_small});
}
:host([size="large"]) .item {
  height: var(--bl-height-large, ${__height_large});
  line-height: var(--bl-height-large, ${__height_large});
}

.item:hover {
  font-weight: 700;
  background-color: #f0f0f0;
}

.item:active,
.item.active,
.item.active:hover {
  font-weight: 700;
  color: var(--bl-color-primary-base, ${__color_primary});
}
.item.disabled,
.item.disabled:hover {
  color: var(--fg-disabled, ${__fg_disabled});
}

.bot {
  height: calc(100% - var(--bl-height-base, ${__height_base}));
}
:host([size="small"]) .bot {
  height: calc(100% - var(--bl-height-small, ${__height_small}));
}
:host([size="large"]) .bot {
  height: calc(100% - var(--bl-height-large, ${__height_large}));
}
`;
