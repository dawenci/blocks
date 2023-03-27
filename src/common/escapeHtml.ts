export function escapeHtml(html: string) {
  const match = /["'&<>]/.exec(html)

  if (!match) {
    return html
  }

  let escape
  let result = ''
  let index = 0
  let lastIndex = 0

  for (index = match.index; index < html.length; index++) {
    switch (html.charCodeAt(index)) {
      case 34: // "
        escape = '&quot;'
        break
      case 38: // &
        escape = '&amp;'
        break
      case 39: // '
        escape = '&#39;'
        break
      case 60: // <
        escape = '&lt;'
        break
      case 62: // >
        escape = '&gt;'
        break
      default:
        continue
    }

    if (lastIndex !== index) {
      result += html.substring(lastIndex, index)
    }

    lastIndex = index + 1
    result += escape
  }

  return lastIndex !== index ? result + html.substring(lastIndex, index) : result
}
