// Popup 的原点，13 种取值的原点以及箭头（如果启用箭头）朝向情况如下：
export enum PopupOrigin {
  // 中间，无箭头
  Center = 'center',
  // 左上角，箭头朝上
  TopStart = 'top-start',
  // 上方中间，箭头朝上
  TopCenter = 'top-center',
  // 右上角，箭头朝上
  TopEnd = 'top-end',
  // 右上角，箭头朝右
  RightStart = 'right-start',
  // 右方中间，箭头朝右
  RightCenter = 'right-center',
  // 右下角，箭头朝右
  RightEnd = 'right-end',
  // 右下角，箭头朝下
  BottomEnd = 'bottom-end',
  // 下方中间，箭头朝下
  BottomCenter = 'bottom-center',
  // 左下角，箭头朝下
  BottomStart = 'bottom-start',
  // 左下角，箭头朝左
  LeftEnd = 'left-end',
  // 左方中间，箭头朝左
  LeftCenter = 'left-center',
  // 左上角，箭头朝左
  LeftStart = 'left-start',
}
