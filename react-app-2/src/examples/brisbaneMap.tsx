import { observer } from "mobx-react-lite";
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
            // TODO: move to env vars
            mapboxApiAccessToken:
              "pk.eyJ1Ijoic2Fqb2RoaWdyb3VwIiwiYSI6ImNrbXNzeGs1bjBsMW4ycG81NmFnZjU2enkifQ.9qbf35asuvDu5ENhl8QRdg",
            mapStyle: "mapbox://styles/mapbox/dark-v10",
          }}
        />
        <section tw="absolute bottom-0 left-0 m-10 rounded-sm p-6 px-10 bg-black text-white opacity-50 text-5xl">
          Some overlay...
        </section>
      </main>
    </>
  );
});
