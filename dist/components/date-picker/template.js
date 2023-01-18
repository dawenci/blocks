import { makeElement } from '../../common/makeElement.js';
import { makeDomTemplate, makeStyleTemplate } from '../../common/template.js';
import { __height_base } from '../../theme/var-light.js';
import { PopupOrigin } from '../popup/index.js';
export const styleTemplate = makeStyleTemplate(`
:host {
  display: inline-block;
  box-sizing: border-box;
  width: calc(var(--bl-height-base, ${__height_base}) * 7 + 10px);
  height: 32px;
  user-select: none;
  cursor: default;
}
:host(:focus) {
  outline: 0 none;
}
#result {
  width: 100%;
}
`);
export const inputTemplate = (() => {
    const $input = makeElement({
        tagName: 'bl-input',
        props: {
            id: 'result',
            suffixIcon: 'date',
            readonly: true,
        },
    });
    return () => $input.cloneNode(true);
})();
export const popupTemplate = makeDomTemplate(makeElement({
    tagName: 'bl-popup',
    props: {
        appendToBody: true,
        className: 'date-picker-popup',
        origin: PopupOrigin.TopStart,
        arrow: true,
        autoflip: true,
    },
    children: [
        {
            tagName: 'bl-date',
            props: { className: 'date-picker-panel' },
        },
        {
            tagName: 'div',
            props: { id: 'action' },
            styles: {
                display: 'none',
                padding: '5px',
                'text-align': 'center',
            },
            children: [
                {
                    tagName: 'bl-button',
                    props: {
                        type: 'primary',
                        size: 'small',
                        block: true,
                        innerHTML: '确定',
                    },
                },
            ],
        },
    ],
}));
