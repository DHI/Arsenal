import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport';
import { addParameters } from '@storybook/react';

addParameters({
  viewport: {
    viewports: { ...INITIAL_VIEWPORTS }
  },
});

export default {
  stories: ['../components/**/*.stories.tsx'],
  addons: [
    '@storybook/addon-viewport/register',
  ]
}