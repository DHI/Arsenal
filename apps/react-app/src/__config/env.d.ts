type TrueFalse = 'true' | 'false';

interface REACT_ENV {
  readonly NODE_ENV: 'production' | 'development' | 'test';
  readonly REACT__COUNTER_ENABLED?: TrueFalse;
}

interface Window {
  store: import('../state/RootStore').RootStore;
  REACT_ENV: REACT_ENV;
}

// For snowpack/vite compat
interface ImportMeta {
  url: string;
  readonly hot: ImportMetaHot;
  readonly env: { readonly [key: string]: any } & REACT_ENV;
}
