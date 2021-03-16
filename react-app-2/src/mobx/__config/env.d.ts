interface ImportMeta {
  url: string;
  readonly hot: ImportMetaHot;
  readonly env: {
    readonly [key: string]: any;
    readonly SNOWPACK_PUBLIC_API_URL: string;
    readonly MODE: string;
    readonly NODE_ENV: string;
    readonly SSR?: boolean;

    readonly SNOWPACK_PUBLIC_FEATURE_COUNTER?: "on" | "off";
  };
}
