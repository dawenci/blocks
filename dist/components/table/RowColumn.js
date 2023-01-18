export function setParent(column, parent) {
    column.parent = parent;
    if (column.fixedLeft) {
        parent.fixedLeft = true;
    }
    else if (column.fixedRight) {
        parent.fixedRight = true;
    }
}
export function make(options) {
    const col = {
        headRender: options.headRender ||
            (column => {
                return document.createTextNode(column.label ?? '');
            }),
        render: options.render ||
            ((data, column, $cell) => {
                return document.createTextNode(data[column.prop] ?? '');
            }),
        summaryRender: options.summaryRender,
        sortMethod: options.sortMethod,
        label: options.label ?? '',
        prop: options.prop ?? '',
        align: options.align ?? 'center',
        width: options.width || 80,
        minWidth: options.minWidth || 0,
        maxWidth: options.maxWidth || Infinity,
        fixedLeft: !!options.fixedLeft,
        fixedRight: !!options.fixedRight,
        sortOrder: ['none', 'ascending', 'descending'].includes(options.sortOrder)
            ? options.sortOrder
            : undefined,
        resizable: !!options.resizable,
        children: (options.children ?? []).map(child => make(child)),
    };
    if (col.children.length) {
        col.children.forEach(child => {
            setParent(child, col);
        });
    }
    return col;
}
