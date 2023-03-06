import { createElement, Fragment, JsxFactory } from '../../common/jsx.js'

export const template = ((jsx: JsxFactory) => {
  const $template = (
    <div id="layout">
      <div id="icon"></div>
    </div>
  )

  return () => $template.cloneNode(true)
})({ createElement, Fragment })
