import { __transition_duration } from '../../theme/var-light.js'

let templateCache: HTMLTemplateElement

export function template() {
  if (templateCache) return templateCache

  const TEMPLATE = /*html*/ `
  <style>
  :host(:not([open])) {
    display: none;
  }
  
  /* 过渡过程持续生效 */
  :host(.collapse-appear-enter-transition-active),
  :host(.collapse-appear-leave-transition-active) {
    display: block;
    overflow: hidden;
    transition-delay: 0, 0;
    transition-property: opacity, height;
    transition-duration: var(--transition-duration, ${__transition_duration}), var(--transition-duration, ${__transition_duration});
    transition-timing-function: cubic-bezier(.645, .045, .355, 1), cubic-bezier(.645, .045, .355, 1);
    pointer-events: none;
  }
  
  /* 打开动作，过渡开始时的状态 */
  :host(.collapse-appear-enter-transition-from) {
    opacity: 0;
    height: 0 !important;
  }
  /* 打开动作，过渡结束时的状态 */
  :host(.collapse-appear-enter-transition-to) {
    opacity: 1;
    /* height 使用 js 设置 */
  }
  
  /* 关闭动作，过渡开始时的状态 */
  :host(.collapse-appear-leave-transition-from) {
  }
  /* 关闭动作，过渡结束时的状态 */
  :host(.collapse-appear-leave-transition-to) {
    opacity: 0;
    height: 0 !important;
  }
  </style>
  `

  const template = document.createElement('template')
  template.innerHTML = TEMPLATE
  return (templateCache = template)
}
