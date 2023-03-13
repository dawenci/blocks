type RequestError = Error & { status: number; url: string }

type RequestOptions = {
  withCredentials?: boolean
  headers?: object
  data?: any
  url: string
  name: string
  file: string | Blob
  progress?: (
    data: {
      lengthComputable: any
      loaded: number
      target: any
      total: number
      percent: number
    },
    options: RequestOptions
  ) => void
  abort?: (error: RequestError, options: RequestOptions) => void
  error?: (error: RequestError, options: RequestOptions) => void
  success?: (data: any, options: RequestOptions) => void
}

export function uploadRequest(options: RequestOptions) {
  const xhr = new XMLHttpRequest()

  if (options.withCredentials && 'withCredentials' in xhr) {
    xhr.withCredentials = true
  }

  const headers = options.headers
  if (typeof headers === 'object') {
    for (const item in headers) {
      if (Object.prototype.hasOwnProperty.call(headers, item) && (headers as any)[item]) {
        xhr.setRequestHeader(item, (headers as any)[item])
      }
    }
  }

  const formData = new FormData()

  if (options.data) {
    Object.keys(options.data).forEach(key => {
      formData.append(key, options.data[key])
    })
  }

  formData.append(options.name, options.file, (options.file as File).name)

  // post 的 progress，要监听 xhr.upload
  if (xhr.upload) {
    // progress 事件，需要在 send 之前绑定
    xhr.upload.onprogress = event => {
      if (options.progress) {
        options.progress(
          {
            lengthComputable: event.lengthComputable,
            loaded: event.loaded,
            target: event.target,
            total: event.total,
            percent: event.lengthComputable ? (event.loaded / event.total) * 100 : 0,
          },
          options
        )
      }
    }

    // 中止事件
    xhr.upload.onabort = () => {
      const err = new Error('abort') as RequestError
      err.status = xhr.status
      err.url = options.url
      if (options.abort) {
        options.abort(err, options)
      }
    }
  }

  xhr.onerror = () => {
    if (options.error) {
      options.error(normalizeError(xhr, options), options)
    }
  }

  xhr.onload = function onload() {
    if (xhr.status < 200 || xhr.status >= 300) {
      if (options.error) {
        options.error(normalizeError(xhr, options), options)
      }
      return
    }

    if (options.success) {
      options.success(normalizeData(xhr), options)
    }
  }

  xhr.open('post', options.url, true)

  xhr.send(formData)

  return {
    abort() {
      xhr.abort()
    },
  }
}

function normalizeError(xhr: XMLHttpRequest, options: RequestOptions): RequestError {
  let msg
  if (xhr.response) {
    msg = `${xhr.response.error || xhr.response}`
  } else if (xhr.responseText) {
    msg = `${xhr.responseText}`
  } else {
    msg = `fail to post ${options.url} ${xhr.status}`
  }

  const err = new Error(msg) as RequestError
  err.status = xhr.status
  err.url = options.url

  return err
}

function normalizeData(xhr: XMLHttpRequest): string | object | Array<any> {
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
