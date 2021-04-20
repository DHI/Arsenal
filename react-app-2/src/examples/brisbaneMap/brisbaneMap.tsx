import { observer } from 'mobx-react-lite';
import { XRoute } from 'xroute';
import { NavBar } from '../../navBar';
import { DeckGlMap } from '../../__components/deckglMap';
import { useStore } from '../../__store/root';
import * as React from 'react';
import { LatLonDisplay } from './latLon';
import { css } from 'twin.macro';
import { CursorCrosshair } from '../../__components/cursorCrosshair';

export const brisbaneMapRoute = XRoute(
  'brisbaneMap',
  '/:language/brisbane/:lat?/:lon?', // TODO: wire up lat/lon to URL
  {} as {
    pathname: { language: string; lat?: string; lon?: string };
    search: {};
    hash: ''; // not using, can omit.
  },
);

export const BrisbaneMapRoot = observer(() => {
  const {
    brisbaneMap: { layers, viewport, cursorPosition },
  } = useStore();

  return (
    <>
      <NavBar />
      <main tw="h-full w-full">
        <DeckGlMap
          layers={layers}
          viewport={viewport}
          staticMap={{
            // TODO: move to env vars
            mapboxApiAccessToken:
              'pk.eyJ1Ijoic2Fqb2RoaWdyb3VwIiwiYSI6ImNrbXNzeGs1bjBsMW4ycG81NmFnZjU2enkifQ.9qbf35asuvDu5ENhl8QRdg',
            mapStyle: 'mapbox://styles/mapbox/dark-v10',
          }}
          deckgl={{
            onHover(info, e) {
              if (!info?.index) return cursorPosition.set(undefined);

              // TODO: can just use the main MapLayerEventModel for this, just make it support coordinates.
              cursorPosition.set({
                latitude: info.coordinate?.[1],
                longitude: info.coordinate?.[0],
                x: info.x,
                y: info.y,
              });
            },
          }}
        />

        <LatLonDisplay />
        <MapTooltips />
        <CursorCrosshair position={cursorPosition.value} />
        <LayerTogglesOverlay />
      </main>
    </>
  );
});

const LayerTogglesOverlay = observer(() => {
  const {
    brisbaneMap: { brisbaneAreaLayerToggle },
  } = useStore();

  return (
    <div tw="absolute top-60 right-0 bg-white opacity-90 text-sm text-red-500 m-5 p-8">
      <input
        type="checkbox"
        checked={brisbaneAreaLayerToggle.value}
        onChange={(e) => brisbaneAreaLayerToggle.set(e.target.checked)}
      />{' '}
      <label>Area Polygon</label>
    </div>
  );
});

const MapTooltips = observer(() => {
  const {
    brisbaneMap: { areaHoverEvent },
  } = useStore();

  return (
    <>
      {areaHoverEvent.isActive && (
        <div
          css={css`
            position: absolute;
            background: white;
            padding: 1em;
            margin: 1em;
            font-size: 90%;
            border-radius: 1em;
            border: 6px solid #8a211388;
          `}
          style={{
            left: `${areaHoverEvent.x ?? 0}px`,
            top: `${areaHoverEvent.y ?? 0}px`,
          }}
        >
          {areaHoverEvent.properties?.title}
        </div>
      )}
    </>
  );
});
