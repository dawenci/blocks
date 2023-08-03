export interface ChunkIterateOptions<T> {
  chunkSize?: number
  schedule?: (task: () => void) => void
  complete?: () => void
  iterator?: Iterator<T>
}

/**
 * 分批迭代，批次之间可以使用同步、异步调度
 */
export function chunkIterate<T>(data: T[], fn: (item: T, index: number) => void, options: ChunkIterateOptions<T>) {
  let index = 0
  const iterator = options.iterator || {
    next: () => {
      return { value: data[index], done: index === data.length }
    },
  }

  const chunkSize = options.chunkSize || 10000

  const batch = () => {
    while (true) {
      const { value, done } = iterator.next()

      if (done) {
        if (options.complete) options.complete()
        break
      }

      fn(value, index)
      index += 1

      if (index % chunkSize === 0 && options.schedule) {
        options.schedule(batch)
        break
      }
    }
  }

  batch()
}
