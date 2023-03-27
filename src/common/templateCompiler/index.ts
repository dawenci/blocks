// 绑定语法：
//
// - attr 绑定:
//   <div bl-attr="attr-name1:dataKey1, attr-name2:dataKey2">
// - prop 绑定：
//   <div bl-prop="propName1:dataKey1, propName2:dataKey2">
// - event 绑定：
//   <div bl-on="event-name.capture.once.stop.stopImmediate.prevent.passive:callback, event-name2:callback2">
// - text 绑定：
//   <t text="dataKey"></t>
// - html 绑定：
//   <rich html="dataKey"></rich>
// - if 绑定：
//   <if cond="dataKey">...</if>
// - for 绑定:
//   <for each="items" as="itemEnv"><t text="itemEnv.dataKey"></for>
//
import { createElement, Fragment } from './jsx.js'

export { setup } from './generate.js'
export { compile } from './compile.js'
export { Widget } from './Widget.js'
export const jsx = { createElement, Fragment }
export type { JsxFactory } from './jsx.js'
