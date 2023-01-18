export const prepend = ($el, $parent) => {
    if ($parent.firstChild) {
        $parent.insertBefore($el, $parent.firstChild);
    }
    else {
        $parent.appendChild($el);
    }
    return $el;
};
export const append = ($el, $parent) => {
    return $parent.appendChild($el);
};
export const mountBefore = ($el, $exists) => {
    if ($exists.parentNode) {
        $exists.parentNode.insertBefore($el, $exists);
    }
    return $el;
};
export const mountAfter = ($el, $exists) => {
    if ($exists.parentNode) {
        if ($exists.nextSibling) {
            $exists.parentNode.insertBefore($el, $exists.nextSibling);
        }
        else {
            $exists.parentNode.appendChild($el);
        }
    }
    return $el;
};
export const unmount = ($el) => {
    if ($el.parentNode) {
        $el.parentNode.removeChild($el);
    }
    return $el;
};
