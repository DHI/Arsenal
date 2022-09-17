import '@fontsource/roboto';
import { useState } from 'react';
import * as stories from './__storyMap';
import { XRoute, XRouter } from 'xroute';
import { createBrowserHistory } from 'history';
import { observer } from 'mobx-react-lite';
import { css, Global } from '@emotion/react';
import { StoryBrowserPage } from 'story-browser';

export const storyBrowserRoute = XRoute(
  'browser',
  '/SB/:story?',
  {} as { search: {}; pathname: { story?: string } },
);

export const storyBrowserStoryRoute = XRoute(
  'story',
  '/S/:story',
  {} as { search: {}; pathname: { story: string } },
);

export const Root = observer(() => {
  const [router] = useState(
    () =>
      new XRouter(
        [storyBrowserRoute, storyBrowserStoryRoute],
        createBrowserHistory(),
      ),
  );

  return (
    <>
      <Global
        styles={css`
          body {
            font-family: 'Roboto';
          }

          * {
            box-sizing: border-box;
          }
        `}
      />
      <StoryBrowserPage
        stories={stories}
        onRouteChange={(route) => {
          if (route.kind === 'indexPage') {
            router.routes.browser.push({
              pathname: { story: route.storyId },
            });
          }

          if (route.kind === 'storyPage') {
            router.routes.story.push({ pathname: { story: route.storyId } });
          }
        }}
        route={(() => {
          if (router.routes.browser.isActive)
            return {
              kind: 'indexPage',
              storyId: router.routes.browser.pathname?.story,
              layout: {
                branding: () => <>DHI Arsenal</>,
              },
            };
          if (router.routes.story.isActive)
            return {
              kind: 'storyPage',
              storyId: router.routes.story.pathname!.story,
            };

          return { kind: 'indexPage', storyId: undefined };
        })()}
      />
    </>
  );
});
