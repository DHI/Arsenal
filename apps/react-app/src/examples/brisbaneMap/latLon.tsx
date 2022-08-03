import { observer } from 'mobx-react-lite';
import { useStore } from '../../__hooks';

export const LatLonDisplay = observer(() => {
  const {
    brisbaneMap: { viewport },
  } = useStore();

  return (
    <>
      <section>
        <h2>Center:</h2>
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
