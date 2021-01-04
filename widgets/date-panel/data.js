export const Depth = Object.freeze({
  // 面板层级为月份，即可以选择 “日”
  Month: 'month',
  // 面板层级为年份，即可以选择 “月”
  Year: 'year',
  // 面板层级为年代，即可以选择“年”
  Decade: 'decade',
  // 面板层级为世纪，即可以选择“年代”
  Century: 'century',
})

export const DepthValue = Object.freeze({
  [Depth.Century]: 0,
  [Depth.Decade]: 1,
  [Depth.Year]: 2,
  [Depth.Month]: 3,
})
