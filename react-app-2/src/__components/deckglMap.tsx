import { Layer } from "@deck.gl/core";
import DeckGL from "@deck.gl/react";
import { observer } from "mobx-react-lite";
import React from "react";
import { StaticMap } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { MapViewportModel } from "../__store/__models/mapViewport";
import styled from "@emotion/styled";

/** A basic wrapper on top of the DeckGL component, coupled to the MapViewportModel */
export const DeckGlMap = observer<{
  viewport: MapViewportModel;
  layers: Layer<any>[];
  /** Be sure to provide mapStyle & token. */
  staticMap: Partial<PropsOf<typeof StaticMap>>;
  deckgl?: Partial<PropsOf<typeof DeckGL>>;

  children?: React.ReactNode;
  className?: string;
}>(
  ({
    viewport,
    layers,
    children,
    className,
    staticMap,
    deckgl: deckglProps,
  }) => (
    <$DeckGlMap className={className}>
      <DeckGL
        height="100%"
        width="100%"
        viewState={viewport.viewState}
        controller={true}
        onViewStateChange={(v) => {
          viewport.set(v.viewState);

          if (deckglProps?.onViewStateChange) deckglProps?.onViewStateChange(v);
        }}
        layers={layers}
        {...deckglProps}
      >
        <StaticMap height="100%" width="100%" {...staticMap} />
        {children}
      </DeckGL>
    </$DeckGlMap>
  )
);

export const $DeckGlMap = styled.main`
  height: 100%;
  width: 100%;

  #deckgl-wrapper {
    overflow: hidden !important;
  }
`;
