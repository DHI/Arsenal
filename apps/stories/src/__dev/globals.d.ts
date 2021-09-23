interface REACT_ENV {
  readonly NODE_ENV: 'production' | 'development' | 'test';
  readonly REACT__BMP_SERVICE_URL?: string;
}

interface Window {
  REACT_ENV: REACT_ENV;
}

// For snowpack/vite compat
interface ImportMeta {
  url: string;
  readonly hot: ImportMetaHot;
  readonly env: { readonly [key: string]: any } & REACT_ENV;
}
