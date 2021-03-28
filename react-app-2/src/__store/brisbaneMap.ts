import { makeAutoObservable } from "mobx";
import { RootStore } from "./root";
import { MapViewportModel } from "./__models/mapViewport";
import { StateModel } from "./__models/primitives";

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

  cursorPosition = new StateModel<
    undefined | { x: number; y: number; latitude?: number; longitude?: number }
  >(undefined);

  get layers() {
    return [];
  }
}
