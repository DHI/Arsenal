import { Layer } from '@deck.gl/core';
import DeckGL from '@deck.gl/react';
import { observer } from 'mobx-react-lite';
import { ReactNode } from 'react';
import { StaticMap } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MapViewportModel } from '../__store/__models/mapViewport';
import { styled } from '__css';

/** A basic wrapper on top of the DeckGL component, coupled to the MapViewportModel */
export const DeckGlMap = observer<{
  viewport: MapViewportModel;
  layers: Layer<any>[];
  /** Be sure to provide mapStyle & token. */
  staticMap: Partial<PropsOf<typeof StaticMap>>;
  deckgl?: Partial<PropsOf<typeof DeckGL>>;

  children?: ReactNode;
  className?: string;
}>(
  ({
    viewport,
    layers,
    children,
    className,
    staticMap,
    deckgl: deckglProps = {},
  }) => {
    return (
      <DeckGL
        height="100%"
        width="100%"
        viewState={viewport.viewState}
        layers={layers}
        controller={true}
        onViewStateChange={(v) => {
          viewport.set(v.viewState);

          if (deckglProps?.onViewStateChange) deckglProps?.onViewStateChange(v);
        }}
        {...(deckglProps as any)}
      >
        <StaticMap
          height="100%"
          width="100%"
          mapStyle="mapbox://styles/mapbox/outdoors-v11"
          {...staticMap}
        />
        {children}
      </DeckGL>
    );
  },
);

export const $DeckGlMap = styled.main`
  height: 100%;
  width: 100%;

  #deckgl-wrapper {
    overflow: hidden !important;
  }
`;
