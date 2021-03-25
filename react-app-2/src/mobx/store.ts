/* eslint-disable react-hooks/rules-of-hooks */
import { makeAutoObservable } from "mobx";
import { createContext, useContext } from "react";
import { createRouter } from "./routing";

export class RootStore {
  constructor() {
    makeAutoObservable(this);

    window.store = this; // Can use store in chrome devtools console
  }

  router = createRouter();
  counter = new CounterStore(this);
  anyPage = new AnyPageStore(this);
}

/** An example store to handle page state & encapsulate routing. */
export class AnyPageStore {
  constructor(private root: RootStore) {
    makeAutoObservable(this);
  }

  get route() {
    return this.root.router.routes.pageAny;
  }

  get activePage() {
    return this.route.params?.page;
  }

  get activePageInteger() {
    return Number(this.activePage ?? -1);
  }

  setPage = (page: this["activePage"] | number) => {
    if (isNaN(Number(page))) throw new Error("Cant set not number pages!");

    this.route.push({ page: page?.toString() });
  };
}

/** A really useless store. */
export class CounterStore {
  constructor(private root: RootStore) {
    makeAutoObservable(this);
  }

  count = 0;

  incr = () => ++this.count;
  decr = () => --this.count;

  setCount = (count: this["count"]) => (this.count = count);

  get exampleOfAccessingRoot() {
    return this.root.router.route?.key;
  }
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
