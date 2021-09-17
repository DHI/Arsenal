import * as React from 'react';
import { RenderStory, useStoryBrowser } from 'story-browser';
import { observer } from 'mobx-react-lite';
import * as modules from './STORY_MAP';
import { useStore } from '../../__store/root';
import { css } from '__css';

export const StoryBrowserRenderPage = observer(() => {
  const {
    router: {
      routes: { storyBrowserRender: route },
    },
  } = useStore();

  const { stories } = useStoryBrowser({ modules });
  const story = stories.get(route.pathname?.story ?? '');

  if (!story) {
    console.log('Warning: StoryBrowserRenderPage: No story ');

    return <></>;
  }

  return (
    <div
      css={css`
        border: 2px solid red;
      `}
    >
      <RenderStory story={story} context={{}} />
    </div>
  );
});
