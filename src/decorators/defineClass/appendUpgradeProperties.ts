export function appendUpgradeProperties<T extends CustomElementConstructor>(target: T, upgradeProps: string[]) {
  if (upgradeProps.length) {
    let newGetter: any
    if (hasUpgradeProperties(target)) {
      const mergedProps = [...new Set((target.upgradeProperties ?? []).concat(upgradeProps))]
      newGetter = () => mergedProps
    } else {
      newGetter = () => upgradeProps
    }
    Object.defineProperty(target, 'upgradeProperties', {
      get: () => newGetter(),
      enumerable: true,
      configurable: true,
    })
  }
}

// 检测继承链上各个 class 是否有需要升级的属性
function hasUpgradeProperties<T>(target: T): target is T & { get upgradeProperties(): string[] } {
  return (target as any).upgradeProperties
}
