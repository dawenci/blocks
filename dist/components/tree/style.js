import { __font_family, __color_primary, __border_color_base, __transition_duration, __fg_base, __font_size_small, __bg_base, __color_danger, } from '../../theme/var-light.js';
export const style = `
:host {
  --height: 28px;

  font-family: var(--font-family, ${__font_family});
  transition: color var(--transition-duration, ${__transition_duration}), border-color var(--transition-duration, ${__transition_duration});  
  font-size: 14px;
  color: var(--bl-fg-base, ${__fg_base});
}

:host([direction="horizontal"]) #list,
:host(:not([direction="horizontal"])) #list {
  flex-flow: column nowrap;
  width: 100%;
}

/* 结点容器 */
.node-item {
  position: relative;
  min-width: var(--item-height);
  width: auto;
  box-sizing: border-box;
  display: flex;
  width: 100%;
  margin: 0;
  padding: 0;
  line-height: 20px;
  font-size: var(font-size-small, ${__font_size_small});
}
.node-item:hover {
  background-color: var(--bl-bg-base, ${__bg_base});
}
.node-item.node-item-active {
  color: var(--bl-color-primary-base, ${__color_primary});
  /*background-color: $--bl-color-primary-hover-9;*/
}

:host([stripe]) .node-item:nth-child(even) {
  background-color: rgba(0,0,0,.025);
}

:host([border]) .node-item:before,
:host([border]) .node-item:after {
  position: absolute;
  top: auto;
  right: 0;
  bottom: auto;
  left: 0;
  display: block;
  content: '';
  height: 1px;
  background: rgba(0,0,0,.05);
  transform: scale(1, 0.5);
}
:host([border]) .node-item:before {
  top: -0.5px;
}
:host([border]) .node-item:after {
  bottom: -0.5px;
}
:host([border]) .node-item:first-child:before,
:host([border]) .node-item:last-child:after {
  display: none;
}


/* 子节点折叠、展开箭头 */
.node-toggle {
  flex: 0 0 24px;
  position: relative;
  display: block;
  width: 24px;
  height: var(--height);
  text-align: center;
}

.node-toggle.folded:before,
.node-toggle.expanded:before {
  display: block;
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: 0;
  height: 0;
  margin: auto;
  border: 4px dashed transparent;
  border-right: 0 none;
  border-left: 5px solid transparent;
  transition: all var(--transition-duration, ${__transition_duration});
}
.node-toggle.folded:before {
  border-left-color: #c0c4cc;
}
.node-toggle.expanded:before {
  border-left-color: #c0c4cc;
  transform: rotate(90deg);
}
.node-toggle.folded:hover:before,
.node-toggle.expanded:hover:before {
  border-left-color: #888;
}

/* 结点的选择框 */
.node-check {
  overflow: hidden;
  flex: 0 0 19px;
  position: relative;
  width: 19px;
  height: var(--height);
  text-align: left;
  line-height: var(--height);
}
.node-check-input {
  position: absolute;
  overflow: hidden;
  width: 0;
  height: 0;
  /* 隐藏 */
  top: -100px;
  left: -100px;
  visibility: hidden;
}
.node-check-label {
  box-sizing: border-box;
  position: absolute;
  top: 0;
  right: auto;
  bottom: 0;
  left: 0;
  margin: auto;
  display: block;
  width: 14px;
  height: 14px;
  border: 1px solid var(--bl-border-color-base, ${__border_color_base});
  background: #fff;
  font-size: 0;
}
.node-check-label:hover {
  border-color: var(--bl-color-primary-base, ${__color_primary});
}

/* 复选框的圆角 2 px */
.node-check-input[type="checkbox"] + .node-check-label {
  border-radius: 2px;
}
/* 单选的圆角，正圆形 */
.node-check-input[type="radio"] + .node-check-label {
  border-radius: 50%;
}
/* 选中状态的，高亮颜色 */
/* 半选中状态的，高亮颜色 */
.node-check-input[checked] + .node-check-label,
.node-check-input[type="checkbox"]:indeterminate + .node-check-label,
.node-check-input.indeterminate[type="checkbox"] + .node-check-label {
  border-color: var(--bl-color-primary-base, ${__color_primary});
  background-color: var(--bl-color-primary-base, ${__color_primary});
}

.node-check-input[type="radio"] + .node-check-label:after {
  box-sizing: border-box;
  content: "";
  border: 1px solid transparent;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  margin: auto;
  transition: transform var(--transition-duration, ${__transition_duration}) ease-in;
  background-color: transparent;
}
.node-check-input[type="checkbox"] + .node-check-label:after {
  box-sizing: content-box;
  content: "";
  border: 1px solid transparent;
  border-left: 0;
  border-top: 0;
  height: 7px;
  left: 4px;
  position: absolute;
  top: 1px;
  width: 3px;
  transition: transform var(--transition-duration, ${__transition_duration}) ease-in;
  transform-origin: center;
  transform: rotate(45deg) scaleY(1);
}
/* 选中状态下的复选框内部样式 */
.node-check-input[type="checkbox"][checked] + .node-check-label:after {
  border-color: #fff;
}
/* 选中状态下的单选框内部样式 */
.node-check-input[type="radio"][checked] + .node-check-label:after {
  border-color: #fff;
  background: #fff;
}
/* 半选中状态下的复选框内部样式 */
.node-check-input:indeterminate[type="checkbox"] + .node-check-label:after,
/* IE 11 */
.node-check-input.indeterminate[type="checkbox"] + .node-check-label:after {
  content: "";
  position: absolute;
  display: block;
  background-color: #fff;
  width: 11px;
  height: 2px;
  transform: scale(.5);
  left: 0;
  right: 0;
  top: 5px;
  transition: none;
}

/* 禁用状态 */
.node-check-input[disabled] + .node-check-label,
.node-check-input[disabled] + .node-check-label:hover {
  border-color: var(--bl-border-color-base, ${__border_color_base});
  background-color: var(--bl-bg-base, ${__bg_base});
  cursor: not-allowed;
}
.node-check-input[disabled][checked][type="checkbox"] + .node-check-label:after {
  border-color: var(--bl-border-color-base, ${__border_color_base});
}
.node-check-input[disabled][checked][type="radio"] + .node-check-label:after {
  background: var(--bl-border-color-base, ${__border_color_base});
}

/* 结点 label 文本 */
.node-label {
  flex: 1 1 auto;
  overflow: hidden;
  padding: 4px 0;
  user-select: none;
}

:host(:not([wrap])) .node-label > span {
  display: block;
  width: 100%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.node-label .highlight {
  color: var(--bl-color-danger-base, ${__color_danger});
}
`;
