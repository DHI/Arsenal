import * as React from 'react';
import { StoryBrowser, useStoryBrowser } from 'story-browser';
import { observer } from 'mobx-react-lite';
import * as modules from './STORY_MAP';
import { useStore } from '../../__store/root';

export const StoryBrowserPage = observer(() => {
  const {
    router: {
      routes: { storyBrowser, storyBrowserRender },
    },
  } = useStore();

  const { stories } = useStoryBrowser({
    modules,
    /** Enable this inside each story instead of it being global. */
    useIframe: false,
  });

  return (
    <StoryBrowser
      stories={stories}
      activeStoryId={storyBrowser.pathname?.story}
      onActiveStoryIdChanged={(story) =>
        storyBrowser.push({ pathname: { story } })
      }
      layout={{
        asFullscreenOverlay: true,
      }}
      onStoryUri={({ storyId }) =>
        `#${storyBrowserRender.toUri({ pathname: { story: storyId } })}`
      }
    />
  );
});
