import { createElement, Fragment } from '../../common/jsx.js';
export const template = ((jsx) => {
    const $template = (jsx.createElement("div", { id: "layout" },
        jsx.createElement("div", { id: "icon" })));
    return () => $template.cloneNode(true);
})({ createElement, Fragment });
