export const makeStyleTemplate = (content) => {
    let cache;
    return () => {
        if (cache) {
            return cache.cloneNode(true);
        }
        cache = document.createElement('style');
        cache.textContent = content;
        return cache.cloneNode(true);
    };
};
export const makeTemplate = (html) => {
    let cloneTemplate;
    return () => {
        if (cloneTemplate) {
            return cloneTemplate.cloneNode(true);
        }
        const $tempParent = document.createElement('div');
        $tempParent.innerHTML = html;
        if ($tempParent.childElementCount > 1) {
            throw new Error('More than one root node.');
        }
        cloneTemplate = $tempParent.removeChild($tempParent.firstElementChild);
        return cloneTemplate.cloneNode(true);
    };
};
export const makeFragmentTemplate = (html) => {
    const $fragment = document.createDocumentFragment();
    const $tempParent = document.createElement('div');
    $tempParent.innerHTML = html;
    while ($tempParent.children.length) {
        $fragment.appendChild($tempParent.children[0]);
    }
    return () => {
        return $fragment.cloneNode(true);
    };
};
export const makeDomTemplate = (template) => {
    return () => {
        return template.cloneNode(true);
    };
};
