export const getElementTarget = (event: Event): HTMLElement | null => {
  if (event.target instanceof HTMLElement) {
    return event.target
  }
  return null
}
