/* eslint-disable react-hooks/rules-of-hooks */
import { makeAutoObservable } from 'mobx';
import { NumberedPagesStore } from './NumberedPageStore';
import { DataStore } from './DataStore';
import { BrisbaneMapStore } from './BrisbaneMapStore';
import { createHashHistory } from 'history';
import { XRouter } from 'xroute';
import { brisbaneMapRoute } from '../examples/brisbaneMap/brisbaneMap';
import { homePageRoute } from '../examples/homePage';
import { numberedPagesRoute } from '../examples/numberedPage';
import {
  storyBrowserRoute,
  storyBrowserRenderRoute,
} from '../__stories/__storyBrowser/__routes';

/**
 * This apps global state.
 */
export class RootStore {
  router = new XRouter(
    [
      storyBrowserRoute,
      storyBrowserRenderRoute,
      homePageRoute,
      numberedPagesRoute,
      brisbaneMapRoute,
    ],
    createHashHistory(),
  );

  numberedPages = new NumberedPagesStore(this);
  brisbaneMap = new BrisbaneMapStore(this);
  data = new DataStore(this);

  constructor() {
    makeAutoObservable(this);

    window.store = this; // Access the store in browser devtools console/debugger
  }
}
