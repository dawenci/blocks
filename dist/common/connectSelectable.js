export function connectSelectable($result, $list, options) {
    const useCaptureResult = options?.captureResult ?? false;
    const useCaptureList = options?.captureList ?? false;
    const onResultClear = () => {
        if (typeof $list.clearSelected === 'function') {
            $list.clearSelected();
        }
    };
    $result.addEventListener('select-result:clear', onResultClear, useCaptureResult);
    const onResultDeselect = event => {
        if (typeof $list.deselect === 'function') {
            $list.deselect(event.detail.value);
        }
    };
    $result.addEventListener('select-result:deselect', onResultDeselect, useCaptureResult);
    const onResultSearch = event => {
        if (typeof $list.searchSelectable === 'function') {
            $list.searchSelectable(event.detail.searchString);
        }
    };
    $result.addEventListener('select-result:search', onResultSearch, useCaptureResult);
    const onListSelect = event => {
        if (typeof $result.select === 'function') {
            $result.select(event.detail.value);
        }
    };
    $list.addEventListener('select-list:select', onListSelect, useCaptureList);
    const onListDeselect = event => {
        if (typeof $result.deselect === 'function') {
            $result.deselect(event.detail.value);
        }
    };
    $list.addEventListener('select-list:deselect', onListDeselect, useCaptureList);
    const onListChange = event => {
        if (typeof $result.acceptSelected === 'function') {
            $result.acceptSelected(event.detail.value);
        }
    };
    $list.addEventListener('select-list:change', onListChange, useCaptureList);
    return () => {
        $result.removeEventListener('select-result:clear', onResultClear, useCaptureResult);
        $result.removeEventListener('select-result:deselect', onResultDeselect, useCaptureResult);
        $result.removeEventListener('select-result:search', onResultSearch, useCaptureResult);
        $list.removeEventListener('select-list:select', onListSelect, useCaptureList);
        $list.removeEventListener('select-list:deselect', onListDeselect, useCaptureList);
        $list.removeEventListener('select-list:change', onListChange, useCaptureList);
    };
}
