/* eslint-disable react-hooks/rules-of-hooks */
import { createHashHistory } from 'history';
import { observer } from 'mobx-react-lite';
import * as React from 'react';
import { XRouter } from 'xroute';
import {
  BrisbaneMapRoot,
  brisbaneMapRoute,
} from './examples/brisbaneMap/brisbaneMap';
import { HomePageRoot, homePageRoute } from './examples/homePage';
import { NumberedPagesRoot, numberedPagesRoute } from './examples/numberedPage';
import { useStore } from './__store/root';
import {
  LazyStoryBrowserPage,
  LazyStoryBrowserRenderPage,
  storyBrowserRenderRoute,
  storyBrowserRoute,
} from './__stories/__storyBrowser/__routes';

export const Routes = observer(() => {
  const {
    router: { route, routes },
  } = useStore();

  const routeToComponent: {
    [k in keyof typeof routes]: React.ComponentType;
  } = {
    homePage: HomePageRoot,
    numberedPages: NumberedPagesRoot,
    brisbaneMap: BrisbaneMapRoot,
    storyBrowser: LazyStoryBrowserPage,
    storyBrowserRender: LazyStoryBrowserRenderPage,
  };

  const RoutedComponent = routeToComponent[route?.key ?? 'homePage'];

  return <RoutedComponent />;
});

export function createRouter() {
  return new XRouter(
    [
      storyBrowserRoute,
      storyBrowserRenderRoute,
      homePageRoute,
      numberedPagesRoute,
      brisbaneMapRoute,
    ],
    createHashHistory(),
  );
}
