import '@emotion/react';

type MyTheme = {};

declare module '@emotion/react' {
  export interface Theme extends MyTheme {}
}
