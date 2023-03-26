import { __radius_base } from '../../theme/var-light.js';
import { makeTemplate } from '../../common/template.js';
export const slotTemplate = makeTemplate(`<slot style="display:none;"></slot>`);
export const popupTemplate = makeTemplate(`<bl-popup append-to-body origin="top-start" arrow>
<div class="option-list" style="overflow:hidden;min-height:20px;border-radius:var(--bl-radius-base, ${__radius_base});"></div>
</bl-popup>`);