export const Depth = Object.freeze({
  Month: 'month',
  Year: 'year',
  Decade: 'decade',
  // Century: 'century',
})

export const DepthValue = Object.freeze({
  [Depth.Decade]: 0,
  [Depth.Year]: 1,
  [Depth.Month]: 2,
})
