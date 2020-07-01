declare namespace NodeJS {
  export interface ProcessEnv {
    // ...
  }
}

declare module '*.png' {
  const v: string;

  export default v;
}

type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;
type IBasicFn = (...args: any[]) => any;

/** Gets the return type of an function which may return a promise (or regular fn) */
declare type AsyncReturnType<T extends IBasicFn> = UnwrapPromise<ReturnType<T>>;
