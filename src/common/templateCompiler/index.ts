// 绑定语法：
// - attr 绑定： <div bl:attr-name="dataKey">
// - prop 绑定：
//    <div bl-prop:attr-name="dataKey">
//    <div bl-prop:attr-name.camel="dataKey">
// - event 绑定：
//     <div bl-on:event-name.capture.once.stop.stopImmediate.prevent.passive="callback">
//     <div bl-on:event-name.camel.capture.once.stop.stopImmediate.prevent.passive="callback">
// - text 绑定：{dataKey}
// - html 绑定：<bl-html content="dataKey"></bl-html>
// - if 绑定：<bl-if cond="dataKey">...</bl-if>
// - for 绑定 <bl-for each:item-env="list">{itemEnv.someText}</bl-for>
//            OR
//            <bl-for each:item-env="list" index="indexEnv">{indexEnv.value} - {itemEnv.someText}</bl-for>
export { compile } from './compile.js'
