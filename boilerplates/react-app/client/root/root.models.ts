import { types as t, Instance, SnapshotIn } from 'mobx-state-tree';
import { TinyMstRouter } from 'tiny-mst-router';
import { ExampleModel } from '../example/example';

export type IStore = Instance<typeof RootModel>;
export type IStoreSnapshot = SnapshotIn<IStore>;

export const RootModel = t.model({
  router: t.optional(TinyMstRouter, {}),
  example: t.optional(
    t.late(() => ExampleModel),
    {},
  ),
});
