export const enum HookType {
  Connected,
  Disconnected,
  Adopted,
  AttributeChanged,
  Render,
}

export type ConnectedCallback = () => void
export type DisconnectedCallback = () => void
export type AdoptedCallback = () => void
export type AttributeChangedCallback<StrArr extends readonly string[]> = (
  name: OneOf<StrArr>,
  oldValue: string | null,
  newValue: string | null
) => void
export type RenderCallback = () => void

export interface HookEventMap {
  [HookType.Connected]: ConnectedCallback
  [HookType.Disconnected]: DisconnectedCallback
  [HookType.Adopted]: AdoptedCallback
  [HookType.AttributeChanged]: AttributeChangedCallback<any>
  [HookType.Render]: RenderCallback
}
