import * as React from 'react';
import { StoryBrowser, useStoryBrowser, RenderStory } from 'story-browser';
import { observer } from 'mobx-react-lite';
import * as modules from './STORIES';
import { useRouter } from './routing';
import { XRoute } from 'xroute';

export const storyBrowserRoute = XRoute(
  'storyBrowser',
  '/SB/:story?',
  {} as { search: {}; pathname: { story?: string } },
);

export const storyBrowserStoryRoute = XRoute(
  'storyBrowserStory',
  '/S/:story',
  {} as { search: {}; pathname: { story: string } },
);

export const StoryBrowserPage = observer(() => {
  const { routes } = useRouter();

  const { stories } = useStoryBrowser({
    modules,
    /** Enable this inside each story instead of it being global. */
    useIframe: false,
  });

  return (
    <StoryBrowser
      stories={stories}
      activeStoryId={routes.storyBrowser.pathname?.story}
      onActiveStoryIdChanged={(story) =>
        routes.storyBrowser.push({ pathname: { story } })
      }
      layout={{
        asFullscreenOverlay: true,
      }}
      onStoryUri={({ storyId }) =>
        routes.storyBrowserStory.toUri({ pathname: { story: storyId } })
      }
    />
  );
});

export const StoryBrowserStoryPage = observer(() => {
  const { routes } = useRouter();
  const { stories } = useStoryBrowser({ modules });
  const story = stories.get(routes.storyBrowserStory.pathname?.story ?? '');

  if (!story) return <>...</>;

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
      }}
    >
      <RenderStory story={story} context={{}} />
    </div>
  );
});
