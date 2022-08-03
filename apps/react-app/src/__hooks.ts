import { createContext, useContext } from 'react';
import { RootStore } from './__store/RootStore';

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
