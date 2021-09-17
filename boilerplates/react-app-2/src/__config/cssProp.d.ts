// eslint-disable-next-line
import * as React from 'react'

type CSSProp = any;

declare module 'react' {
  interface Attributes {
    css?: CSSProp;
  }
}
