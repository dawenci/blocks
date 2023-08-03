import { __radius_base, __color_primary, __color_warning, __transition_duration, __height_base, __height_small, __height_large, __color_primary_light, __bg_disabled, __fg_secondary, __fg_disabled, } from '../../theme/var-light.js';
export const style = `
@keyframes rotate360 {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

:host {
  display: inline-block;
  box-sizing: border-box;
  user-select: none;
  cursor: default;
  font-size: 12px;
  background-color: #fff;
  padding: 5px;
}
:host(:focus) {
  outline: 0 none;
}

#layout:focus {
  outline: 0 none;
}
#layout {
  box-sizing: border-box;
  position: relative;
  width: calc(var(--bl-height-base, ${__height_base}) * 7);
  height: calc(var(--bl-height-base, ${__height_base}) * 8);
}
:host([size="small"]) #layout {
  width: calc(var(--bl-height-small, ${__height_small}) * 7);
  height: calc(var(--bl-height-small, ${__height_small}) * 8);
}
:host([size="large"]) #layout {
  width: calc(var(--bl-height-large, ${__height_large}) * 7);
  height: calc(var(--bl-height-large, ${__height_large}) * 8);
}

#header {
  box-sizing: border-box;
  display: flex;
  flex-flow: row nowrap;
  overflow: hidden;
  width: 100%;
  height: var(--bl-height-base, ${__height_base});
  line-height: var(--bl-height-base, ${__height_base});
  cursor: default;
}
:host([size="small"]) #header {
  height: var(--bl-height-small, ${__height_small});
  line-height: var(--bl-height-small, ${__height_small});
}
:host([size="large"]) #header {
  height: var(--bl-height-large, ${__height_large});
  line-height: var(--bl-height-large, ${__height_large});
}

.header-button {
  flex: 0 0 var(--bl-height-base, ${__height_base});
  box-sizing: border-box;
  overflow: hidden;
  position: relative;
  display: block;
  width: var(--bl-height-base, ${__height_base});
  height: 100%;
  margin: 0;
  padding: 0;
  border: 0 none;
  background-color: transparent;
  text-align: center;
  outline: 0;
  transition: var(--bl-transition-duration, ${__transition_duration}) all;
}
:host([size="small"]) .header-button {
  flex: 0 0 var(--bl-height-small, ${__height_small});
  width: var(--bl-height-small, ${__height_small});
}
:host([size="large"]) .header-button {
  flex: 0 0 var(--bl-height-large, ${__height_large});
  width: var(--bl-height-large, ${__height_large});
}

.header-button::before,
.header-button::after {
  display: block;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  margin: auto;
  content: '';
  width: 6px;
  height: 6px;
  transform: rotate(45deg);
  border-width: 0;
  border-style: solid;
  border-color: #666;
}

.header-button:hover::before,
.header-button:hover::after,
.header-button:active::before,
.header-button:active::after,
.header-button:focus::before,
.header-button:focus::after {
  border-color: var(--bl-color-primary-base, ${__color_primary});
}

.header-button.button-prevPrev::before,
.header-button.button-prevPrev::after {
  border-bottom-width: 1px;
  border-left-width: 1px;
}
.header-button.button-prevPrev::after {
  left: 8px;
}

.header-button.button-prev::before {
  border-bottom-width: 1px;
  border-left-width: 1px;
}

.header-button.button-next::before {
  border-top-width: 1px;
  border-right-width: 1px;
}

.header-button.button-nextNext::before,
.header-button.button-nextNext::after {
  border-top-width: 1px;
  border-right-width: 1px;
}
.header-button.button-nextNext::after {
  right: 8px;
}

.header-content {
  box-sizing: border-box;
  flex: 1 1 100%;
  height: var(--bl-height-base, ${__height_base});
  text-align: center;
  font-size: inherit;
}
:host([size="small"]) .header-content {
  height: var(--bl-height-small, ${__height_small});
}
:host([size="large"]) .header-content {
  height: var(--bl-height-large, ${__height_large});
}

.header-title {
  box-sizing: border-box;
  overflow: hidden;
  width: 100%;
  height: calc(var(--bl-height-base, ${__height_base}) - 10px);
  line-height: calc(var(--bl-height-base, ${__height_base}) - 10px);
  font-size: inherit;
  margin: 5px auto;
  border: 0 none;
  border-radius: 3px;
  background: transparent;
}
:host([size="small"]) .header-title {
  height: calc(var(--bl-height-small, ${__height_small}) - 10px);
  line-height: calc(var(--bl-height-small, ${__height_small}) - 10px);
}
:host([size="large"]) .header-title {
  height: calc(var(--bl-height-large, ${__height_large}) - 10px);
  line-height: calc(var(--bl-height-large, ${__height_large}) - 10px);
}

.header-title:focus {
  outline: 0 none;
  background-color: #f0f0f0;
  color: var(--bl-color-primary-base, ${__color_primary});
}
.header-title:hover {
  color: var(--bl-color-primary-base, ${__color_primary});
}

#body {
  box-sizing: border-box;
  position: relative;
  width: 100%;
  height: calc(var(--bl-height-base, ${__height_base}) * 7);
}
:host([size="small"]) #body {
  height: calc(var(--bl-height-small, ${__height_small}) * 7);
}
:host([size="large"]) #body {
  height: calc(var(--bl-height-large, ${__height_large}) * 7);
}

.week-header {
  box-sizing: border-box;
  position: relative;
  display: flex;
  flex-flow: row nowrap;
  height: calc(var(--bl-height-base, ${__height_base}) - 5px);
  box-shadow: inset 0 -1px 1px #f0f0f0;
  line-height: calc(var(--bl-height-base, ${__height_base}) - 6px);
  font-size: inherit;
  text-align: center;
  transition: var(--bl-transition-duration, ${__transition_duration}) all;
  color: var(--bl-fg-secondary, ${__fg_secondary});
}
:host([size="small"]) .week-header {
  height: calc(var(--bl-height-small, ${__height_small}) - 5px);
  line-height: calc(var(--bl-height-small, ${__height_small}) - 6px);
}
:host([size="large"]) .week-header {
  height: calc(var(--bl-height-large, ${__height_large}) - 5px);
  line-height: calc(var(--bl-height-large, ${__height_large}) - 6px);
}

.week-header span {
  box-sizing: border-box;
  display: block;
  width: var(--bl-height-base, ${__height_base});
}
:host([size="small"]) .week-header span {
  width: var(--bl-height-small, ${__height_small});
}
:host([size="large"]) .week-header span {
  width: var(--bl-height-large, ${__height_large});
}

.button-list {
  box-sizing: border-box;
  overflow: hidden;
  position: relative;
  display: flex;
  flex-flow: row wrap;
  width: 100%;
  transition: var(--bl-transition-duration, ${__transition_duration}) all;
}
:host([size="small"]) .button-list {
  /*padding: 5px;*/
}
:host([size="large"]) .button-list {
  /*padding: 8px;*/
}

.body-month .button-list {
  height: calc(var(--bl-height-base, ${__height_base}) * 6);
  margin-top: 5px;
}
:host([size="small"]) .body-month .button-list {
  height: calc(var(--bl-height-small, ${__height_small}) * 6);
}
:host([size="large"]) .body-month .button-list {
  height: calc(var(--bl-height-large, ${__height_large}) * 6);
}

.body-year .button-list,
.body-decade .button-list,
.body-century .button-list {
  height: calc(var(--bl-height-base, ${__height_base}) * 7);
}
:host([size="small"]) .body-year .button-list,
:host([size="small"]) .body-decade .button-list,
:host([size="small"]) .body-century .button-list {
  height: calc(var(--bl-height-small, ${__height_small}) * 7);
}
:host([size="large"]) .body-year .button-list,
:host([size="large"]) .body-decade .button-list,
:host([size="large"]) .body-century .button-list {
  height: calc(var(--bl-height-large, ${__height_large}) * 7);
}

.button-item {
  box-sizing: border-box;
  position: relative;
  margin: 0;
  padding: 1px;
  border: 0;
  background: none;
  font-size: inherit;
  transition: height var(--bl-transition-duration, ${__transition_duration});
}
.button-item:focus {
  outline: 0 none;
}
/* 单选模式，使用圆角 */
.button-item:not(.button-item--rangeIn) span {
  border-radius: var(--bl-radius-base, ${__radius_base});
}
.button-item.button-item--rangeFrom span {
  border-top-left-radius: var(--bl-radius-base, ${__radius_base});
  border-bottom-left-radius: var(--bl-radius-base, ${__radius_base});
}
.button-item.button-item--rangeTo span {
  border-top-right-radius: var(--bl-radius-base, ${__radius_base});
  border-bottom-right-radius: var(--bl-radius-base, ${__radius_base});
}
/* range 模式，左右按钮移除间隙 */
.button-item.button-item--rangeIn {
  padding: 1px 0;
}

.button-item span {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  transition: color var(--bl-transition-duration, ${__transition_duration}),
    background var(--bl-transition-duration, ${__transition_duration});
}
.button-item:focus span {
  background-color: #f0f0f0;
  color: var(--bl-color-primary-base, ${__color_primary});
}

/* 7 col * 5 row */
.body-month .button-item {
  width: var(--bl-height-base, ${__height_base});
  height: var(--bl-height-base, ${__height_base});
}
:host([size="small"]) .body-month .button-item {
  width: var(--bl-height-small, ${__height_small});
  height: var(--bl-height-small, ${__height_small});
}
:host([size="large"]) .body-month .button-item {
  width: var(--bl-height-large, ${__height_large});
  height: var(--bl-height-large, ${__height_large});
}

/* 3 col * 4 row */
.body-year .button-item {
  width: calc(var(--bl-height-base, ${__height_base}) * 7 / 3);
  height: calc(var(--bl-height-base, ${__height_base}) * 7 / 4);
}
:host([size="small"]) .body-year .button-item {
  width: calc(var(--bl-height-small, ${__height_small}) * 7 / 3);
  height: calc(var(--bl-height-small, ${__height_small}) * 7 / 4);
}
:host([size="large"]) .body-year .button-item {
  width: calc(var(--bl-height-large, ${__height_large}) * 7 / 3);
  height: calc(var(--bl-height-large, ${__height_large}) * 7 / 4);
}

/* 2 col * 5 row */
.body-century .button-item,
.body-decade .button-item {
  width: calc(var(--bl-height-base, ${__height_base}) * 7 / 2);
  height: calc(var(--bl-height-base, ${__height_base}) * 7 / 5);
}
:host([size="small"]) .body-century .button-item,
:host([size="small"]) .body-decade .button-item {
  width: calc(var(--bl-height-small, ${__height_small}) * 7 / 2);
  height: calc(var(--bl-height-small, ${__height_small}) * 7 / 5);
}
:host([size="large"]) .body-century .button-item,
:host([size="large"]) .body-decade .button-item {
  width: calc(var(--bl-height-large, ${__height_large}) * 7 / 2);
  height: calc(var(--bl-height-large, ${__height_large}) * 7 / 5);
}


.button-item.button-item--otherMonth span {
  color: var(--bl-fg-secondary, ${__fg_secondary});
}
.button-item[disabled] span {
  background-color: var(--bl-bg-disabled, ${__bg_disabled});
  color: var(--bl-fg-disabled, ${__fg_disabled});
}

.button-item:not([disabled]):hover span {
  background-color: #f0f0f0;
}

.button-item.button-item--today span {
  color: var(--bl-color-primary-base, ${__color_primary});
  text-shadow: 0 0 1px var(--bl-color-primary-base, ${__color_primary});
}

.button-item.button-item--includesActive span {
  color: var(--bl-color-primary-base, ${__color_primary});
  text-shadow: 0 0 1px var(--bl-color-primary-base, ${__color_primary});
}

.button-item.button-item--rangeIn span,
.button-item.button-item--rangeIn:hover span,
.button-item.button-item--rangeIn:active span {
  background-color: var(--bl-color-primary-hover, ${__color_primary_light});
  color: #fff;
}

.button-item.button-item--active span,
.button-item.button-item--active:hover span,
.button-item.button-item--active:active span {
  background-color: var(--bl-color-primary-base, ${__color_primary});
  color: #fff;
}

.button-badge {
  box-sizing: border-box;
  display: block;
  position: absolute;
  overflow: hidden;
  width: 6px;
  height: 6px;
  background: var(--bl-color-warning-base, ${__color_warning});
  border: 1px solid #fff;
  border-radius: 50%;
  top: 3px;
  right: 3px;
}

.body-loading {
  display: none;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: rgba(255,255,255,.8);
}
:host([loading]) .body-loading {
  display: block;
}
`;
