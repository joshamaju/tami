type HTMLEventAttributes = Partial<
  Record<`on${keyof HTMLElementEventMap}`, string>
>;

declare namespace svelteHTML {
  interface HTMLAttributes<T> extends HTMLEventAttributes {}
}
