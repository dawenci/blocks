import { BlModel } from '../../BlModel.js'

export const resolve = <T extends object>(env: BlModel<T>, key: keyof T, ...path: (keyof T)[]): any => {
  let value: any = env instanceof BlModel ? env.get(key) : env[key]
  for (let i = 0, l = path.length; value && i < l; i += 1) {
    if (!(value = value[path[i]])) break
  }
  return value
}
