import { makeAutoObservable } from "mobx";
import { RootStore } from "./root";
import { MapViewportModel } from "./__models/mapViewport";

export class BrisbaneMapStore {
  constructor(private root: RootStore) {
    makeAutoObservable(this);
  }

  // TODO: add map page route

  viewport = new MapViewportModel({
    latitude: 2, // FIXME
    longitude: 3,
  });

  get layers() {
    return [];
  }
}
