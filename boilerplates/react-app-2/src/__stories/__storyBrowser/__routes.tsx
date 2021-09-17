import loadable from '@loadable/component';
import * as React from 'react';
import { XRoute } from 'xroute';

export const LazyStoryBrowserPage = loadable(
  () => import('./storyBrowserPage'),
  {
    resolveComponent: (m) => m.StoryBrowserPage,
    fallback: <></>,
  },
);

export const LazyStoryBrowserRenderPage = loadable(
  () => import('./storyBrowserRenderPage'),
  {
    resolveComponent: (m) => m.StoryBrowserRenderPage,
    fallback: <></>,
  },
);

export const storyBrowserRoute = XRoute(
  'storyBrowser',
  '/STORIES/:story?',
  {} as { search: {}; pathname: { story?: string } },
);

export const storyBrowserRenderRoute = XRoute(
  'storyBrowserRender',
  '/STORY/:story',
  {} as { search: {}; pathname: { story: string } },
);
