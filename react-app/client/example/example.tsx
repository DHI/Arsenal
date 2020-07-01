import * as React from 'react';
import { AppBar, Box, Typography, Input } from '@material-ui/core';

import { types as t } from 'mobx-state-tree';
import { useStore } from '../store';
import styled from 'styled-components';
import { observer } from 'mobx-react-lite';

export const Example = observer(() => {
  const { example } = useStore();

  return (
    <>
      <AppBar position="fixed" />
      <Box p={8} textAlign="center">
        <Typography variant="h2">Example Component</Typography>
        <Box p={4} />
        <$Input
          value={example.text}
          onChange={(e) => example.setText(e.target.value)}
        />
        <Box p={4} />
        <Typography variant="h3">{example.fancyText}</Typography>
      </Box>
    </>
  );
});

const $Input = styled(Input)`
  width: 100%;
  &,
  input {
    font-size: inherit;
  }
  input {
    padding: 1em;
    font-size: inherit;
    text-align: center;
  }
`;

export const ExampleModel = t
  .model({
    text: 'Text Input',
  })
  .views((self) => ({
    get fancyText() {
      return `~ ~[ [ ${self.text.toLowerCase()} ] ] ~ ~`;
    },
  }))
  .actions((self) => ({
    setText(text: typeof self.text) {
      self.text = text.trim().toUpperCase();
    },
  }));
