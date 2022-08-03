import { useState } from 'react';
import { StoreReactContext, useStore } from './__hooks';
import { RootStore } from './__store/RootStore';
/* eslint-disable react-hooks/rules-of-hooks */
import { observer } from 'mobx-react-lite';
import { BrisbaneMapRoot } from './examples/brisbaneMap/brisbaneMap';
import { HomePageRoot } from './examples/homePage';
import { NumberedPagesRoot } from './examples/numberedPage';
import { StoryBrowserPage } from './__stories/__storyBrowser/storyBrowserPage';
import { StoryBrowserRenderPage } from './__stories/__storyBrowser/storyBrowserRenderPage';

export function Root() {
  const [store] = useState(() => new RootStore());

  return (
    <StoreReactContext.Provider value={store}>
      <Routes />
    </StoreReactContext.Provider>
  );
}

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
    storyBrowser: StoryBrowserPage,
    storyBrowserRender: StoryBrowserRenderPage,
  };

  const RoutedComponent = routeToComponent[route?.key ?? 'homePage'];

  return <RoutedComponent />;
});
