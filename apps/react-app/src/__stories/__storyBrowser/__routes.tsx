import { XRoute } from 'xroute';

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
