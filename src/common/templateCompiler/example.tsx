import { JsxFactory } from './jsx.js'

export const template = (jsx: JsxFactory) => {
  return (
    <div class="test" bl-on="click.once<-onClick">
      <div bl-prop="prop-name<-prop"></div>
      <input bl-attr="value<-title" bl-on="input<-onInput" />
      <p bl-attr="title<-title">
        prefix <t text="text"></t> suffix
      </p>

      <template>
        测试Template
        <p>测试 Template P</p>
      </template>

      <if cond="cond">
        <p>
          外层 IF block: <t text="cond"></t>
        </p>
        <if cond="cond2">
          内层 if block <t text="cond2"></t>
        </if>
      </if>

      <for each="list1" as="item1">
        <p>
          <t text="item1.name"></t> - <t text="item1.nested.value"></t>
        </p>
      </for>

      <for each="list2" as="item">
        <div class="list-item">
          <h3>list item</h3>
          <p>
            List Item: <t text="item.itemName"></t>
            <t text="title"></t>
          </p>
        </div>
      </for>

      <rich html="html"></rich>
      <p>
        <t text="nestData.dot"></t>
      </p>
      <p>
        <t text='nestData[ "index1" ]'></t>
      </p>
      <p>
        <t text="nestData['index2']"></t>
      </p>
    </div>
  )
}
