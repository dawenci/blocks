const normalizeError = (xhr, options) => {
  let msg
  if (xhr.response) {
    msg = `${xhr.response.error || xhr.response}`
  }
  else if (xhr.responseText) {
    msg = `${xhr.responseText}`
  }
  else {
    msg = `fail to post ${options.url} ${xhr.status}`
  }

  const err = new Error(msg)
  err.status = xhr.status
  err.url = options.url

  return err
}

const normalizeData = (xhr) => {
  const text = xhr.responseText || xhr.response

  if (!text) {
    return text
  }

  try {
    return JSON.parse(text)
  } catch (e) {
    return text
  }
}

export function uploadRequest(options) {
  const xhr = new XMLHttpRequest()
  const url = options.url

  if (options.withCredentials && 'withCredentials' in xhr) {
    xhr.withCredentials = true
  }

  const headers = options.headers
  if (typeof headers === 'object') {
    for (const item in headers) {
      if (Object.prototype.hasOwnProperty.call(headers, item) && headers[item]) {
        xhr.setRequestHeader(item, headers[item])
      }
    }
  }

  const formData = new FormData()

  if (options.data) {
    Object.keys(options.data)
      .forEach((key) => {
        formData.append(key, options.data[key])
      })
  }

  formData.append(options.name, options.file, options.file.name)

  // post 的 progress，要监听 xhr.upload
  if (xhr.upload) {
    // progress 事件，需要在 send 之前绑定
    xhr.upload.onprogress = (event) => {
      if (options.progress) {
        options.progress({
          lengthComputable: event.lengthComputable,
          loaded: event.loaded,
          target: event.target,
          total: event.total,
          percent: event.lengthComputable ? event.loaded / event.total * 100 : 0
        })
      }
    }

    // 中止事件
    xhr.upload.onabort = () => {
      const err = new Error('abort')
      err.status = xhr.status
      err.url = options.url
      if (options.abort) options.abort(err)
    }
  }

  xhr.onerror = () => {
    if (options.error) {
      options.error(normalizeError(xhr, options))
    }
  }

  xhr.onload = function onload() {
    if (xhr.status < 200 || xhr.status >= 300) {
      if (options.error) {
        options.error(normalizeError(xhr, options))
      }
      return
    }

    if (options.success) {
      options.success(normalizeData(xhr))
    }
  }

  xhr.open('post', url, true)

  xhr.send(formData)

  return {
    abort() {
      xhr.abort()
    }
  }
}
