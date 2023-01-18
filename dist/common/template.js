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
    let cache;
    return () => {
        if (cache) {
            return cache.content.firstElementChild.cloneNode(true);
        }
        cache = document.createElement('template');
        cache.innerHTML = html;
        return cache.content.firstElementChild.cloneNode(true);
    };
};
export const makeFragmentTemplate = (html) => {
    let cache;
    return () => {
        if (cache) {
            return cache.content.cloneNode(true);
        }
        cache = document.createElement('template');
        cache.innerHTML = html;
        return cache.content.cloneNode(true);
    };
};
export const makeDomTemplate = (template) => {
    return () => {
        return template.cloneNode(true);
    };
};
