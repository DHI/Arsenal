import { JSXElementConstructor } from 'react';

/** Shorter alias to React.ComponentProps<C> */
export type PropsOf<
  C extends keyof JSX.IntrinsicElements | JSXElementConstructor<any>
> = React.ComponentProps<C>;

/** Alias for React.ReactNode */
export type RN = React.ReactNode;

/** Function component */
export type FC<P extends {} = {}> = (p: P) => JSX.Element;
