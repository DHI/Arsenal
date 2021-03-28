import { makeAutoObservable } from "mobx";
import { BrisbaneAreaFeature } from "../examples/__config";
import { ICursorPosition } from "../__components/cursorCrosshair";
import { pickableGeoJsonLayer } from "../__components/mapLayers";
import { RootStore } from "./root";
import { MapLayerEventModel } from "./__models/mapLayerEvent";
import { MapViewportModel } from "./__models/mapViewport";
import { StateModel } from "./__models/primitives";
import brisbaneFc from "../__assets/exampleBrisbaneGeoJson.json";

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

  cursorPosition = new StateModel<undefined | ICursorPosition>(undefined);

  areaHoverEvent = new MapLayerEventModel<BrisbaneAreaFeature>();

  get route() {
    return this.root.router.routes.brisbaneMap;
  }

  get brisbaneAreaLayers() {
    this.areaHoverEvent.id;

    // NOTE: .slice() ensures the layer is regenered every time this function is called
    const features = brisbaneFc.features.slice() as BrisbaneAreaFeature[];

    return [
      pickableGeoJsonLayer({
        id: "myarea",
        features,
        hoverEvent: this.areaHoverEvent,
        layer: {
          getFillColor: ({ id }) => {
            if (this.areaHoverEvent.id === id) return [255, 100, 100, 140];

            return [255, 100, 100, 70];
          },
        },
      }),
    ];
  }

  get layers() {
    return [...this.brisbaneAreaLayers];
  }
}
