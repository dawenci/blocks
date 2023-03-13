import './menu-group.js';
import './menu-item.js';
import { makeDomTemplate } from '../../common/template.js';
export const contentTemplate = makeDomTemplate(document.createElement('slot'));
export const itemTemplate = makeDomTemplate(document.createElement('bl-nav-menu-item'));
export const groupTemplate = makeDomTemplate(document.createElement('bl-nav-menu-group'));
