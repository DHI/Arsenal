import { Layer } from "@deck.gl/core";
import DeckGL from "@deck.gl/react";
import { observer } from "mobx-react-lite";
import React from "react";
import { StaticMap } from "react-map-gl";
import "mapbox-gl/src/css/mapbox-gl.css";
import { MapViewportModel } from "../__store/__models/mapViewport";
import { css, cx } from "@emotion/css";

/** A basic wrapper on top of the DeckGL component */
export const DeckGlMap = observer<{
  viewport: MapViewportModel;
  layers: Layer<any>[];
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
    <main
      className={cx(
        css`
          height: 100%;
          width: 100%;

          #deckgl-wrapper {
            overflow: hidden !important;
          }
        `,
        className
      )}
    >
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
        <StaticMap
          height="100%"
          width="100%"
          mapStyle="mapbox://styles/jharper93/ckm0qhxx69hkj17qk6d058ct6"
          mapboxApiAccessToken="pk.eyJ1IjoiamhhcnBlcjkzIiwiYSI6ImNrNHkwaWNtZTA2NWYzam14bzQzbzVuNm8ifQ.JXnAeNYWelY8Dx0_tW3SnA"
          {...staticMap}
        />
        {children}
      </DeckGL>
    </main>
  )
);
