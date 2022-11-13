export function makeMessages(moduleName: string, defaultMessages = {}) {
  return (key: string) => {
    const messages =
      (window as any).BlocksUI?.messages?.[moduleName] ?? defaultMessages
    return messages[key] ?? ''
  }
}
