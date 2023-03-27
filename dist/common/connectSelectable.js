export function connectSelectable($result, $list, options) {
    const useCaptureResult = options?.captureResult ?? false;
    const useCaptureList = options?.captureList ?? false;
    const transformSelectedForResult = options?.transformSelectedForResult ?? ((selected) => selected);
    const transformSelectedForList = options?.transformSelectedForList ?? ((selected) => selected);
    const onResultClear = () => {
        if (typeof $list.clearSelected === 'function') {
            $list.clearSelected();
            options?.afterHandleResultClear?.();
        }
    };
    $result.addEventListener('select-result:clear', onResultClear, useCaptureResult);
    const onResultDeselect = event => {
        if (typeof $list.deselect === 'function') {
            const selected = transformSelectedForList(event.detail.value);
            $list.deselect(selected);
            options?.afterHandleResultDeselect?.(selected);
        }
    };
    $result.addEventListener('select-result:deselect', onResultDeselect, useCaptureResult);
    const onResultSearch = event => {
        if (typeof $list.searchSelectable === 'function') {
            $list.searchSelectable(event.detail.searchString);
            options?.afterHandleResultSearch?.(event.detail.searchString);
        }
    };
    $result.addEventListener('select-result:search', onResultSearch, useCaptureResult);
    const onListChange = event => {
        if (typeof $result.acceptSelected === 'function') {
            const selectedArr = event.detail.value;
            const selected = selectedArr.map(transformSelectedForResult);
            $result.acceptSelected(selected);
            options?.afterHandleListChange?.(selected);
        }
    };
    $list.addEventListener('select-list:change', onListChange, useCaptureList);
    return () => {
        $result.removeEventListener('select-result:clear', onResultClear, useCaptureResult);
        $result.removeEventListener('select-result:deselect', onResultDeselect, useCaptureResult);
        $result.removeEventListener('select-result:search', onResultSearch, useCaptureResult);
        $list.removeEventListener('select-list:change', onListChange, useCaptureList);
    };
}
export function connectPairSelectable($result, $list, options) {
    const useCaptureResult = options?.captureResult ?? false;
    const useCaptureList = options?.captureList ?? false;
    const transformSelectedForResult = options?.transformSelectedForResult ?? ((selected) => selected);
    const onResultClear = () => {
        if (typeof $list.clearSelected === 'function') {
            $list.clearSelected();
            options?.afterHandleResultClear?.();
        }
    };
    $result.addEventListener('pair-result:clear', onResultClear, useCaptureResult);
    const onListChange = event => {
        if (typeof $result.acceptSelected === 'function') {
            const [first, second] = event.detail.value;
            const values = [
                first ? transformSelectedForResult(first) : null,
                second ? transformSelectedForResult(second) : null,
            ];
            $result.acceptSelected(values);
            options?.afterHandleListChange?.(values);
        }
    };
    $list.addEventListener('pair-select-list:change', onListChange, useCaptureList);
    return () => {
        $result.removeEventListener('pair-result:clear', onResultClear, useCaptureResult);
        $list.removeEventListener('pair-select-list:change', onListChange, useCaptureList);
    };
}
