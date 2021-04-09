/* eslint-disable react-hooks/rules-of-hooks */
import { makeAutoObservable } from 'mobx';
import { createContext, useContext } from 'react';
import { createRouter } from '../routing';
import { NumberedPagesStore } from './numberedPage';
import { ApiStore } from './api';
import { BrisbaneMapStore } from '../examples/brisbaneMap/brisbaneMap.store';

/**
 * This apps global state.
 */
export class RootStore {
  router = createRouter();
  numberedPages = new NumberedPagesStore(this);
  brisbaneMap = new BrisbaneMapStore(this);
  api = new ApiStore(this);

  constructor() {
    makeAutoObservable(this);

    window.store = this; // Access the store in browser devtools console/debugger
  }
}

export const StoreReactContext = createContext<RootStore | undefined>(
  undefined,
);

export function useStore() {
  return (
    useContext(StoreReactContext) ??
    (() => {
      throw new Error('RootStoreReactContext missing.');
    })()
  );
}
