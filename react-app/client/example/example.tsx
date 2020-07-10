import * as React from 'react';
import {
  AppBar,
  Box,
  Typography,
  Input,
  Button,
  InputLabel,
  Divider,
  TextField,
} from '@material-ui/core';

import {
  types as t,
  SnapshotIn,
  getParentOfType,
  Instance,
  getSnapshot,
} from 'mobx-state-tree';
import { useStore } from '../store';
import styled from 'styled-components';
import { observer } from 'mobx-react-lite';
import { RootModel } from '../root/root.models';
import { ILocation, TinyMstRouter } from 'tiny-mst-router';

export const Example = observer(() => {
  const { example, router } = useStore();
  const exampleSnapshot = getSnapshot(example);

  return (
    <>
      <AppBar position="fixed" />
      <Box p={8}>
        <Typography variant="h2" align="center">
          Example Component
        </Typography>
        <Box p={4} />
        <$Input
          value={example.text}
          onChange={(e) => example.setText(e.target.value)}
        />
        <Box p={4} />
        <Typography variant="h5">fancyText example:</Typography>
        <Box p={4} pl={4}>
          <Typography variant="body1">{example.fancyText}</Typography>
        </Box>
        <Divider />
        <Typography variant="h5">ExampleItem example:</Typography>
        <Box p={4} pl={4}>
          <ExampleItem text="Foo" />
        </Box>
        <Divider />
        <Box py={4}>
          <Typography variant="h5">Pages example:</Typography>
          <Box py={4} pl={4}>
            <Typography variant="h6">
              Current URL pathname (Editable!):
              <Typography variant="subtitle1">
                <em>Try inputting '/user/23232' or ' '</em>
              </Typography>
            </Typography>
            <br />
            <TextField
              variant="outlined"
              value={router.location.pathname}
              onChange={(e) => example.setUrlPath(e.target.value)}
            />
            <br />
            <br />
            <Typography variant="h6">router.location JSON: </Typography>
            <code>{JSON.stringify(router.location)}</code>
            <br />
            <br />

            <Typography variant="h6">fromUrl JSON:</Typography>
            <code>{JSON.stringify(example.fromUrl)}</code>
          </Box>
          <Box p={4}>
            <Typography variant="h5">Routing example:</Typography>
            {example.fromUrl?.page === 'user' && <p>is user page!</p>}
            {example.fromUrl?.userId && (
              <p>
                is on user profile page for user <b>{example.fromUrl.userId}</b>
              </p>
            )}
          </Box>
          <Box py={3}></Box>
        </Box>
      </Box>
    </>
  );
});

const ExampleItem = observer(
  (initialState: SnapshotIn<typeof ExampleItemModel>) => {
    const [store] = React.useState(() => ExampleItemModel.create(initialState));

    return (
      <Button onClick={() => store.setText(store.text + '!')}>
        {store.text}
      </Button>
    );
  },
);

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
    get router(): Instance<typeof TinyMstRouter> {
      return getParentOfType(self, RootModel).router;
    },
    get fancyText() {
      return `~ ~[ [ ${self.text.toLowerCase()} ] ] ~ ~`;
    },
    get fromUrl() {
      // NOTE: Notice how we are usin `this.router`? This is how you can access views defined in the same view block
      const location: ILocation = this.router.location; // Fixes circular type reference

      if (!location.pathname) return;

      /**
       * @example /user/829294 generates ['user', '829294]
       * @example /bar/baz/ generates ['bar', 'baz']
       */
      const parts: (string | undefined)[] = location.pathname
        .replace(/^\//, '') // Remove slash from start of pathname
        .split('/');

      // This matches the "user" page
      if (parts[0] === 'user') {
        const [page, userId] = parts;

        // When we know it's the users page, we can infer that parts[1] is the userId
        return { page, userId };
      }

      return {
        page: parts[0],
      };
    },
  }))
  .actions((self) => ({
    setText(text: typeof self.text) {
      self.text = text.trim().toUpperCase();
    },
    /**
     * This is a very broad action which just sets the entire pathname
     */
    setUrlPath(value: string) {
      const { router } = getParentOfType(self, RootModel);

      router.replace(value);
    },
    goToUserPage(userId: string) {
      // This will cause the `self.fromUrl` value to get updated with { page: 'user', userId }
      self.router.replace(`/user/${userId}`);
    },
  }));

export const ExampleItemModel = t
  .model({ text: 'Text Input' })
  .actions((self) => ({
    setText(text: typeof self.text) {
      self.text = text;
    },
  }));
