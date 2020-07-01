import CssBaseline from '@material-ui/core/CssBaseline';
import {
  createMuiTheme,
  MuiThemeProvider,
  Theme,
} from '@material-ui/core/styles';
import * as React from 'react';
import { Helmet } from 'react-helmet';
import { createGlobalStyle, ThemeProvider } from 'styled-components';
import 'typeface-roboto';
import { Stuff } from '../example/test';
import { createStore, MstContextProvider } from '../store';
import { IStore } from './root.models';

/** The entry point for the app. */
export const createEntryComponent = () => {
  const { store } = createStore();

  const Entry = () => (
    <Root theme={muiTheme} store={store}>
      <Stuff />
    </Root>
  );

  return Entry;
};

/**
 * Responsible for setting up top level context providers.
 */
export const Root = ({
  theme,
  store,
  children,
}: {
  /** An instance of the root MST store */
  store: IStore;
  /** A Material UI theme (Also provided to StyledComponents) */
  theme: Theme;
  children: React.ReactNode;
}) => (
  <MstContextProvider value={store}>
    <MuiThemeProvider theme={theme}>
      <ThemeProvider theme={theme}>
        <Head />
        <CssBaseline />
        <$GlobalStyle />
        {children}
      </ThemeProvider>
    </MuiThemeProvider>
  </MstContextProvider>
);

const Head = () => (
  <Helmet>
    <title>My Title</title>
  </Helmet>
);

export const muiTheme = createMuiTheme({
  palette: {
    type: 'light',
  },
});

const $GlobalStyle = createGlobalStyle`
  body {
    font-family: "Roboto", -apple-system, BlinkMacSystemFont, "Segoe UI", "Oxygen",
      "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue",
      sans-serif;
  }

  b, strong {
    font-weight: 500;
  }
`;
