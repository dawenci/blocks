export function uploadRequest(options) {
    const xhr = new XMLHttpRequest();
    if (options.withCredentials && 'withCredentials' in xhr) {
        xhr.withCredentials = true;
    }
    const headers = options.headers;
    if (typeof headers === 'object') {
        for (const item in headers) {
            if (Object.prototype.hasOwnProperty.call(headers, item) && headers[item]) {
                xhr.setRequestHeader(item, headers[item]);
            }
        }
    }
    const formData = new FormData();
    if (options.data) {
        Object.keys(options.data).forEach(key => {
            formData.append(key, options.data[key]);
        });
    }
    formData.append(options.name, options.file, options.file.name);
    if (xhr.upload) {
        xhr.upload.onprogress = event => {
            if (options.progress) {
                options.progress({
                    lengthComputable: event.lengthComputable,
                    loaded: event.loaded,
                    target: event.target,
                    total: event.total,
                    percent: event.lengthComputable ? (event.loaded / event.total) * 100 : 0,
                }, options);
            }
        };
        xhr.upload.onabort = () => {
            const err = new Error('abort');
            err.status = xhr.status;
            err.url = options.url;
            if (options.abort) {
                options.abort(err, options);
            }
        };
    }
    xhr.onerror = () => {
        if (options.error) {
            options.error(normalizeError(xhr, options), options);
        }
    };
    xhr.onload = function onload() {
        if (xhr.status < 200 || xhr.status >= 300) {
            if (options.error) {
                options.error(normalizeError(xhr, options), options);
            }
            return;
        }
        if (options.success) {
            options.success(normalizeData(xhr), options);
        }
    };
    xhr.open('post', options.url, true);
    xhr.send(formData);
    return {
        abort() {
            xhr.abort();
        },
    };
}
function normalizeError(xhr, options) {
    let msg;
    if (xhr.response) {
        msg = `${xhr.response.error || xhr.response}`;
    }
    else if (xhr.responseText) {
        msg = `${xhr.responseText}`;
    }
    else {
        msg = `fail to post ${options.url} ${xhr.status}`;
    }
    const err = new Error(msg);
    err.status = xhr.status;
    err.url = options.url;
    return err;
}
function normalizeData(xhr) {
    const text = xhr.responseText || xhr.response;
    if (!text) {
        return text;
    }
    try {
        return JSON.parse(text);
    }
    catch (e) {
        return text;
    }
}
