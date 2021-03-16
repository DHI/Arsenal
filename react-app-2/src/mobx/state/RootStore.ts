/* eslint-disable react-hooks/rules-of-hooks */
import { makeAutoObservable } from "mobx";
import { createContext, useContext } from "react";
import { createRouter } from "../routing";
import { CounterStore } from "./CounterStore";

export class RootStore {
  constructor() {
    makeAutoObservable(this);

    window.store = this;
  }

  /** Shortcut to useRootStore */
  static use() {
    return useRootStore();
  }

  router = createRouter();
  counter = new CounterStore(this);
}

export const RootStoreReactContext = createContext<RootStore | undefined>(
  undefined
);

export function useRootStore() {
  return (
    useContext(RootStoreReactContext) ??
    (() => {
      throw new Error("RootStoreReactContext missing.");
    })()
  );
}
