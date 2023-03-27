interface MenuItem {
  active?: boolean
  disabled?: boolean
  handler?: (e: MouseEvent) => void
  href?: string
  target: any
  icon?: string
  label: string
  children?: Array<MenuItem | MenuGroup>
}

interface MenuGroup {
  title: string
  data: MenuItem[]
}

type OneOf<A extends readonly string[]> = A[number]

type ConcatStr<S1 extends string, S2 extends string> = `${S1}${S2}`
