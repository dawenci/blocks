import { makeTemplate } from '../../common/template.js'

export const confirmButtonTemplate = makeTemplate<'bl-button'>(/*html*/ `
<bl-button part="confirm-button" type="primary" slot="footer">确定</bl-button>
`)

export const cancelButtonTemplate = makeTemplate<'bl-button'>(/*html*/ `
<bl-button part="cancel-button" slot="footer" style="margin-right:8px">取消</bl-button>
`)

export const contentTemplate = makeTemplate<HTMLElement>(/*html*/ `
<div part="content" style="min-width:200px;padding:20px 0 10px;"></div>
`)
