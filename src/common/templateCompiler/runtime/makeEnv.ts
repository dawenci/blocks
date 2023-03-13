class Env {
  records: Record<string, any> = Object.create(null)
  dirty_keys = new Set()
  constructor(public name: string, public parent: Env | null) {}

  dirty(key: string, data: any) {
    const is_dirty = key in data && data[key] !== this.records[key]
    if (is_dirty) this.dirty_keys.add(key)
    return is_dirty
  }
}

export function makeEnv(name: string, parent: any, records: Record<string, any> = Object.create(null)) {
  const env = new Env(name, parent)
  if (records) env.records = records
  return env
}
