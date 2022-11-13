const messages = (
  (window as any).BlocksUI ?? ((window as any).BlocksUI = { messages: {} })
).messages

Object.assign(messages, {
  ['dropdown-list']: {
    confirm: '确定',
  },

  ['image']: {
    placeholderText: '加载中',
    fallbackText: '加载失败',
  },
})
