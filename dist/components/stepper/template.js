import { __border_color_base, __color_danger, __color_primary, __color_success, __fg_placeholder, __fg_secondary, __font_size_large, __font_size_small, __height_base, __height_large, __height_small, } from '../../theme/var-light.js';
const STEPS_TEMPLATE = `<style>
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

</style>

<div id="layout">
  <slot></slot>
</div>`;
export const stepperTemplate = document.createElement('template');
stepperTemplate.innerHTML = STEPS_TEMPLATE;
const STEP_TEMPLATE = `<style>
:host {
  --size: var(--bl-height-base, ${__height_base});

  flex: 1 1 auto;
  display: inline-block;
  box-sizing: border-box;
}
:host-context(bl-stepper[direction="vertical"]):host(:not(:first-child)) {
  margin-top: 10px;
}
:host-context(bl-stepper:not([direction="vertical"])):host(:not(:first-child)) {
  margin-left: 10px;
}


#layout {
  overflow: hidden;
  position: relative;
  padding-left: calc(var(--size) + 10px);
}
:host-context(bl-stepper[direction="vertical"]) #layout {
  padding-bottom: 10px;
}
:host-context(bl-stepper[direction="vertical"]) #layout:after {
  content: '';
  position: absolute;
  top: calc(var(--size) + 10px);
  left: calc(var(--size) / 2);
  margin: auto;
  width: 1px;
  height: 99999px;
  background: var(--bl-border-color-base, ${__border_color_base});
}

:host(:last-child) #title:after,
:host(:last-child) #layout:after {
  display: none;
}

#icon.empty,
#title.empty,
#description.empty {
  display: none;
}

#icon {
  position: absolute;
  top: 0;
  left: 0;
  width: var(--size);
  height: var(--size);
}
#icon > i {
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 1px solid var(--bl-border-color-base, ${__border_color_base});
  font-style: normal;
}

#title {
  display: inline-block;
  position: relative;
  height: var(--size);
  line-height: var(--size);
  padding-right: 10px;
  white-space: nowrap;
  font-size: var(--bl-font-size-large, ${__font_size_large});
}
:host-context(bl-stepper:not([direction="vertical"])) #title:after {
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  margin: auto;
  left: 100%;
  width: 99999px;
  height: 1px;
  background: var(--bl-border-color-base, ${__border_color_base});
}

#description {
  color: var(--bl-fg-secondary, ${__fg_secondary});  
  font-size: var(--bl-font-size-small, ${__font_size_small});
}

:host-context(bl-stepper[size="small"]) {
  --size: var(--bl-height-small, ${__height_small});
}
:host-context(bl-stepper[size="large"]) {
  --size: var(--bl-height-large, ${__height_large});
}

:host([status="success"]) {
  color: var(--bl-color-success-base, ${__color_success});
  fill: var(--bl-color-success-base, ${__color_success});
}
:host([status="success"]) #icon i {
  border-color: var(--bl-color-success-base, ${__color_success});
}
:host([status="success"]) #description {
  color: var(--bl-color-success-base, ${__color_success});
}
:host([status="success"]) #title:after {
  background-color: var(--bl-color-success-base, ${__color_success});
}

:host([status="error"]) {
  color: var(--bl-color-danger-base, ${__color_danger});
  fill: var(--bl-color-danger-base, ${__color_danger});
}
:host([status="error"]) #icon i {
  border-color: var(--bl-color-danger-base, ${__color_danger});
}
:host([status="error"]) #description {
  color: var(--bl-color-danger-base, ${__color_danger});
}
:host([status="error"]) #title:after {
  background-color: var(--bl-color-danger-base, ${__color_danger});
}

:host([status="process"]) {
  color: var(--bl-color-primary-base, ${__color_primary});
  fill: var(--bl-color-primary-base, ${__color_primary});
}
:host([status="process"]) #icon i {
  border-color: var(--bl-color-primary-base, ${__color_primary});
}
:host([status="process"]) #description {
  color: var(--bl-color-primary-base, ${__color_primary});
}
:host([status="process"]) #title:after {
  background-color: var(--bl-color-primary-base, ${__color_primary});
}

:host([status="wait"]) {
  color: var(--bl-fg-placeholder, ${__fg_placeholder});
  fill: var(--bl-fg-placeholder, ${__fg_placeholder});
}
:host([status="wait"]) #icon i {
  border-color: var(--bl-fg-placeholder, ${__fg_placeholder});
}
:host([status="wait"]) #description {
  color: var(--bl-fg-placeholder, ${__fg_placeholder});
}
:host([status="wait"]) #title:after {
  background-color: var(--bl-fg-placeholder, ${__fg_placeholder});
}
</style>

<div id="layout">
  <div id="icon">
    <slot name="icon"></slot>
  </div>
  <div id="content">
    <div id="title">
      <slot name="title"></slot>
    </div>
    <div id="description">
      <slot name="description"></slot>
    </div>
  </div>
</div>`;
export const stepTemplate = document.createElement('template');
stepTemplate.innerHTML = STEP_TEMPLATE;
