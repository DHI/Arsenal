import React from 'react';
import { createTheme, ThemeOptions, ThemeProvider } from '@material-ui/core';
import { green, blueGrey } from '@material-ui/core/colors';
import { ThemeProvider as StyledThemeProvider, RN } from '@dhi/arsenal.ui';

const baseTheme: ThemeOptions = {
  typography: {
    fontSize: 13,
    h1: { fontSize: 30 },
    h2: { fontSize: 26 },
    h3: { fontSize: 22 },
    h4: { fontSize: 18 },
    h5: { fontSize: 16 },
    h6: { fontSize: 14 },
  },
  palette: {
    primary: { main: green[700] },
    secondary: { main: blueGrey[400] },
  },
  shape: {
    borderRadius: 0,
  },
};

export const muiTheme = createTheme({
  ...baseTheme,
  palette: {
    ...baseTheme.palette,
    type: 'light',
  },
});

export const muiDarkTheme = createTheme({
  ...baseTheme,
  palette: {
    ...baseTheme.palette,
    type: 'dark',
    primary: { main: green[400] },
    secondary: { main: blueGrey[600] },
  },
});

export const WithLightTheme = (p: { children: RN }) => (
  <StyledThemeProvider theme={muiTheme}>
    <ThemeProvider theme={muiTheme} {...p} />
  </StyledThemeProvider>
);

export const WithDarkTheme = (p: { children: RN }) => (
  <StyledThemeProvider theme={muiDarkTheme}>
    <ThemeProvider theme={muiDarkTheme} {...p} />
  </StyledThemeProvider>
);
