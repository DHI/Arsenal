import { GeoJsonLayer } from "@deck.gl/layers";
import { GeoJsonLayerProps } from "@deck.gl/layers/geojson-layer/geojson-layer";
import { toJS } from "mobx";
import { MapLayerEventModel } from "../__store/__models/mapLayerEvent";

export type IFeature = GeoJSON.Feature<GeoJSON.Geometry, {}>;

/** Given GeoJson of shape MultiPolygon/Polygon etc. (areas) */
export function pickableGeoJsonLayer<FEATURE extends IFeature>({
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
  layer?: Partial<GeoJsonLayerProps<FEATURE>>;
}) {
  hoverEvent?.id; // Listen to id changes
  clickEvent?.id; // Listen to id changes

  return new GeoJsonLayer({
    id,
    data: toJS(features),
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
  });
}
