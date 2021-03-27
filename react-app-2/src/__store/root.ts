/* eslint-disable react-hooks/rules-of-hooks */
import { makeAutoObservable } from "mobx";
import { createContext, useContext } from "react";
import { createRouter } from "../routing";
import { AnyPageStore } from "./anyPage";
import { ApiStore } from "./api";

export class RootStore {
  constructor() {
    makeAutoObservable(this);

    window.store = this; // Access the store in browser devtools console/debugger
  }

  router = createRouter();
  anyPage = new AnyPageStore(this);
  api = new ApiStore(this);
}

export const StoreReactContext = createContext<RootStore | undefined>(
  undefined
);

export function useStore() {
  return (
    useContext(StoreReactContext) ??
    (() => {
      throw new Error("RootStoreReactContext missing.");
    })()
  );
}
