import { observer } from "mobx-react-lite";
import * as React from "react";
import { DeckGlMap } from "../__components/deckglMap";
import { useStore } from "../__store/root";

export const MapPageRoot = observer(() => {
  const {
    mapPage: { layers, viewport },
  } = useStore();

  return (
    <>
      <main className={`h-full w-full`}>
        <DeckGlMap layers={layers} viewport={viewport} staticMap={{}} />
        <section
          className={`absolute bottom-0 left-0 w-20 h-10 shadow-md m-2 rounded-sm p-4`}
        >
          Some overlay...
        </section>
      </main>
    </>
  );
});
