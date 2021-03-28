import { observer } from "mobx-react-lite";
import * as React from "react";
import { XRoute } from "xroute";
import { NavBar } from "../navBar";
import { DeckGlMap } from "../__components/deckglMap";
import { useStore } from "../__store/root";

export const brisbaneMapRoute = XRoute(
  "brisbaneMap",
  "/:language/brisbane/:lat?/:lon?",
  {} as { language: string; lat?: string; lon?: string }
);
export const BrisbaneMapRoot = observer(() => {
  const {
    brisbaneMap: { layers, viewport },
  } = useStore();

  return (
    <>
      <NavBar />
      <main tw="h-full w-full">
        <DeckGlMap
          layers={layers}
          viewport={viewport}
          staticMap={{
            mapboxApiAccessToken:
              "pk.eyJ1Ijoic2Fqb2RoaWdyb3VwIiwiYSI6ImNrbXNzeGs1bjBsMW4ycG81NmFnZjU2enkifQ.9qbf35asuvDu5ENhl8QRdg",
            mapStyle: "mapbox://styles/mapbox/dark-v10",
          }}
        />
        <section tw="absolute bottom-0 left-0 w-20 h-10 shadow-md m-2 rounded-sm p-4">
          Some overlay...
        </section>
      </main>
    </>
  );
});
