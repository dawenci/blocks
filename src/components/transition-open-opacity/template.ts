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
  :host(.opacity-enter-transition-active),
  :host(.opacity-leave-transition-active) {
    display: block;
    transition-delay: 0, 0;
    transition-property: opacity;
    transition-duration: var(--transition-duration, ${__transition_duration});
    transition-timing-function: cubic-bezier(.645, .045, .355, 1), cubic-bezier(.645, .045, .355, 1);
    pointer-events: none;
  }
  /* 打开动作，过渡开始时的状态 */
  :host(.opacity-enter-transition-from) {
    opacity: 0;
  }
  /* 打开动作，过渡结束时的状态 */
  :host(.opacity-enter-transition-to) {
    opacity: 1;
  }
  /* 关闭动作，过渡开始时的状态 */
  :host(.opacity-leave-transition-from) {
  }
  /* 关闭动作，过渡结束时的状态 */
  :host(.opacity-leave-transition-to) {
    opacity: 0;
  }
  </style>
  `

  const template = document.createElement('template')
  template.innerHTML = TEMPLATE
  return (templateCache = template)
}
