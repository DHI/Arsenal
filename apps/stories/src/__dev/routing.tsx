/* eslint-disable react-hooks/rules-of-hooks */
import { createBrowserHistory } from 'history';
import { observer } from 'mobx-react-lite';
import * as React from 'react';
import { createContext, useContext } from 'react';
import { XRouter } from 'xroute';
import {
  StoryBrowserPage,
  StoryBrowserStoryPage,
  storyBrowserStoryRoute,
  storyBrowserRoute,
} from './storyBrowser';

export const Routes = observer(() => {
  const { route } = useRouter();

  const RoutedComponent = {
    storyBrowser: StoryBrowserPage,
    storyBrowserStory: StoryBrowserStoryPage,
  }[route?.key ?? 'storyBrowser'];

  return <RoutedComponent />;
});

export const RoutingEntry = () => {
  const [router] = React.useState(() => createRouter());

  return (
    <RoutingContext.Provider value={router}>
      <Routes />
    </RoutingContext.Provider>
  );
};

export const createRouter = () =>
  new XRouter(
    [storyBrowserRoute, storyBrowserStoryRoute],
    createBrowserHistory(),
  );

export type ProjectRouter = ReturnType<typeof createRouter>;

export const RoutingContext = createContext<ProjectRouter | undefined>(
  undefined,
);

export const useRouter = () =>
  useContext(RoutingContext) ??
  (() => {
    throw new Error('RoutingContext missing.');
  })();
