import './globals.d.ts';
import * as React from 'react';
import { render } from 'react-dom';
import { RoutingEntry } from './routing';
import { Global, css } from '@emotion/react';

render(
  <>
    <Global
      styles={css`
        body {
          font-family: 'Roboto';
        }
      `}
    />
    <RoutingEntry />
  </>,
  document.getElementById('__root'),
);

if (import.meta.hot) import.meta.hot.accept();
