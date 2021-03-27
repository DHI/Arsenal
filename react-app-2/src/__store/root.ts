/* eslint-disable react-hooks/rules-of-hooks */
import { makeAutoObservable } from "mobx";
import { createContext, useContext } from "react";
import { createRouter } from "../routing";
import { AnyPageStore } from "./anyPage";
import { CounterStore } from "./counter";

export class RootStore {
  constructor() {
    makeAutoObservable(this);

    window.store = this; // Can use store in chrome devtools console
  }

  router = createRouter();
  counter = new CounterStore();
  anyPage = new AnyPageStore(this);
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
