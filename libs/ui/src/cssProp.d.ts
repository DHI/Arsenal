import { ReactJSXIntrinsicElements } from '@emotion/react/types/jsx-namespace';
import 'react';

type IntrinsicElements = {
  [K in keyof ReactJSXIntrinsicElements]: ReactJSXIntrinsicElements[K] & {
    css?: any;
  };
};
