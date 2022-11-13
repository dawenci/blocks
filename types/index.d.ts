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
