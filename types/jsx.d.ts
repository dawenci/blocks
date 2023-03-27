declare namespace JSX {
  interface IntrinsicElements {
    [elemName: string]: any

    if: { cond: string }
    for: { each: string; as: string }
    t: { text: string }
    rich: { html: string }
  }
}
