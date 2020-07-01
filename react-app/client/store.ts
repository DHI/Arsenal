import { createHashHistory } from 'history';
import { addMiddleware, SnapshotIn, onPatch } from 'mobx-state-tree';
import { mstLog } from 'mst-log';
import { createContext, useContext } from 'react';
import { syncHistoryWithStore } from 'tiny-mst-router';
import { IStore, RootModel, IStoreSnapshot } from './root/root.models';

export { IStore, IStoreSnapshot };

/** Hash history is ideal as it allows one to serve the SPA as a static file */
export const defaultHistory = createHashHistory();

/** Creates the store and syncs the router */
export function createStore(
  snapshot: IStoreSnapshot = {},
  history = defaultHistory,
) {
  const store = RootModel.create(snapshot);

  // Try commenting this out if the logs become too verbose.
  addMiddleware(store, mstLog());

  onPatch(store, (d) => {
    console.log(`STORE PATCH %o`, d);
  });

  const routing = syncHistoryWithStore(history, store.router);

  return { store, routing };
}

const StoreContext = createContext<IStore | undefined>(undefined);

export const MstContextProvider = StoreContext.Provider;

/**
 * A react hook to access the root Mobx State Tree store.
 * @example
 * const { login } = useStore()
 */
export const useStore = () => useContext(StoreContext)!;
