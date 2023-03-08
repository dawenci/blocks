import { makeTemplate } from '../../common/template.js'
import { BlocksPopup } from '../popup/index.js'

export const popupTemplate = makeTemplate<BlocksPopup>(/*html*/ `
<bl-popup>
  <div class="layout" style="padding:15px;">
    <div class="message" style="position:relative;box-sizing:border-box;margin-bottom:15px;font-size:12px;line-height:18px;"></div>
    <div class="actions" style="box-sizing:border-box;text-align:center;">
      <bl-button size="small" class="cancel" style="margin:0 5px;vertical-align:middle;">取消</bl-button>
      <bl-button size="small" class="confirm" type="primary" style="margin:0 5px;vertical-align:middle;">确定</bl-button>
    </div>
  </div>
</bl-popup>
`)
