// For snowpack/vite compat
interface ImportMeta {
  url: string;
  readonly hot: ImportMetaHot;
  readonly env: { readonly [key: string]: any } & REACT_ENV;
}

declare module 'html-to-docx';
