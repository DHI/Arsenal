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

  router = createRouter();
  counter = new CounterStore(this);
}

export const RootStoreReactContext = createContext<RootStore | undefined>(
  undefined
);

export function useStore() {
  return (
    useContext(RootStoreReactContext) ??
    (() => {
      throw new Error("RootStoreReactContext missing.");
    })()
  );
}
