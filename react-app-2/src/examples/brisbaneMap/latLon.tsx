import { observer } from "mobx-react-lite";
import { useStore } from "../../__store/root";
import * as React from "react";

export const LatLonDisplay = observer(() => {
  const {
    brisbaneMap: { viewport },
  } = useStore();

  return (
    <>
      <section tw="absolute bottom-0 left-0 m-10 rounded-sm p-6 px-10 bg-black text-white opacity-60">
        <h2 tw="text-3xl mb-4 text-green-200">Center:</h2>
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
