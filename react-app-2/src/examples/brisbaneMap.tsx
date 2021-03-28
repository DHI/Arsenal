import { observer } from "mobx-react-lite";
import { XRoute } from "xroute";
import { NavBar } from "../navBar";
import { DeckGlMap } from "../__components/deckglMap";
import { useStore } from "../__store/root";
import * as React from "react";
import { BrisbaneMapStore } from "../__store/brisbaneMap";

export const brisbaneMapRoute = XRoute(
  "brisbaneMap",
  "/:language/brisbane/:lat?/:lon?",
  {} as { language: string; lat?: string; lon?: string }
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
              "pk.eyJ1Ijoic2Fqb2RoaWdyb3VwIiwiYSI6ImNrbXNzeGs1bjBsMW4ycG81NmFnZjU2enkifQ.9qbf35asuvDu5ENhl8QRdg",
            mapStyle: "mapbox://styles/mapbox/dark-v10",
          }}
          deckgl={{
            onHover(info, e) {
              if (!info?.index) return cursorPosition.set(undefined);

              cursorPosition.set({
                latitude: info.coordinate?.[0],
                longitude: info.coordinate?.[1],
                x: info.x,
                y: info.y,
              });
            },
          }}
        />

        <LatLonDisplay />
        <CursorCrosshair position={cursorPosition} />
        {/* <CursorCrosshair /> */}
      </main>
    </>
  );
});

const CursorCrosshair = observer<{
  position: BrisbaneMapStore["cursorPosition"];
}>(() => {
  const horLine = <div tw="absolute w-full border border-blue-400" />;
  const vertLine = <div tw="absolute h-full border border-red-400" />;
  const centerDot = <div tw="absolute rounded-lg border-4" />;

  return (
    <>
      {horLine}
      {vertLine}
      {centerDot}
    </>
  );
});

const LatLonDisplay = observer(() => {
  const {
    brisbaneMap: { viewport },
  } = useStore();

  return (
    <>
      <section tw="absolute bottom-0 left-0 m-10 rounded-sm p-6 px-10 bg-black text-white opacity-60">
        <h2 tw="text-3xl mb-4 text-green-200">Position:</h2>
        <p>
          <b>Lat</b>: {viewport.latitude.toFixed(6)}
        </p>
        <p>
          <b>Lon</b>: {viewport.longitude.toFixed(6)}
        </p>
      </section>
    </>
  );
});
