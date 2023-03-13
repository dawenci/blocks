export const resolve = (env: Record<string, any>, ...path: string[]): any => {
  let value: any = env
  for (let i = 0, l = path.length; i < l; i += 1) {
    if (!(value = value[path[i]])) break
  }
  return value
}
