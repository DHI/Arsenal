import { makeAutoObservable } from "mobx";
import { RootStore } from "./root";
import { MapViewportModel } from "./__models/mapViewport";

export class BrisbaneMapStore {
  constructor(private root: RootStore) {
    makeAutoObservable(this);
  }

  // TODO: add map page route

  viewport = new MapViewportModel({
    latitude: -27.4672892,
    longitude: 153.0180984,
    zoom: 14,
    minZoom: 10,
    maxZoom: 20,
  });

  get layers() {
    return [];
  }
}
