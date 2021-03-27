import { GeoJsonLayer } from "@deck.gl/layers";
import { toJS } from "mobx";
import { MapLayerEventModel } from "../__store/__models/mapLayerEvent";

export type IAreaFeature = GeoJSON.Feature<GeoJSON.MultiPolygon, {}>;

/** Given GeoJson of shape MultiPolygon/Polygon etc. (areas) */
export function areaLayers<FEATURE extends IAreaFeature>({
  hoverEvent,
  clickEvent,
  features = [],
  layer: layerProps,
  id,
}: {
  id: string;
  features?: FEATURE[];
  hoverEvent?: MapLayerEventModel<FEATURE>;
  clickEvent?: MapLayerEventModel<FEATURE>;
  layer?: Partial<PropsOf<GeoJsonLayer<FEATURE>>>;
}) {
  hoverEvent?.id; // Listen to id changes
  clickEvent?.id; // Listen to id changes

  const data = toJS(features.slice());

  return [
    new GeoJsonLayer({
      id,
      data,
      pickable: true,
      stroked: true,
      filled: true,
      wireframe: true,
      extruded: false,
      lineWidthUnits: "pixels",
      getFillColor: () => [100, 100, 100, 150],
      getLineColor: () => [100, 100, 100, 255],
      getLineWidth: ({ id }) => {
        if (id === hoverEvent?.id) return 2;

        return 1;
      },
      onHover: hoverEvent?.set,
      onClick: clickEvent?.set,
      ...layerProps,
    }),
  ];
}
