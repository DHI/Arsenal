/** Shorter alias to React.ComponentProps<C> */
declare type PropsOf<
  C extends keyof JSX.IntrinsicElements | JSXElementConstructor<any>
> = React.ComponentProps<C>;
