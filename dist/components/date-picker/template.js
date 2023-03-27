import { makeElement } from '../../common/makeElement.js';
import { makeDomTemplate } from '../../common/template.js';
import { PopupOrigin } from '../popup/index.js';
export const resultTemplate = makeDomTemplate(makeElement({
    tagName: 'bl-select-result',
    props: {
        id: 'result',
        suffixIcon: 'date',
    },
}));
export const inputTemplate = makeDomTemplate(makeElement({
    tagName: 'bl-input',
    props: {
        id: 'result',
        suffixIcon: 'date',
    },
    attrs: {
        readonly: '',
    },
}));
export const popupTemplate = makeDomTemplate(makeElement({
    tagName: 'bl-popup',
    props: {
        appendToBody: true,
        className: 'date-picker-popup',
        origin: PopupOrigin.TopStart,
        arrow: 8,
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
