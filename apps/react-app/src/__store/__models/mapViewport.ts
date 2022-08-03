import { makeAutoObservable, toJS } from 'mobx';

export class MapViewportModel {
  constructor(initialState: Partial<MapViewportModel>) {
    makeAutoObservable(this);

    this.set(initialState);
    this.initialState = toJS(this);
  }

  initialState: MapViewportModel;
  latitude = 0;
  longitude = 0;
  zoom = 8.3;
  minZoom = 7;
  maxZoom = 11;

  boundary: undefined | { sw: LatLonMap; ne: LatLonMap } = undefined;

  get viewState() {
    return toJS(this);
  }

  set = (props: Partial<MapViewportModel>) => {
    if (!this.boundary || !props.latitude || !props.longitude) {
      Object.assign(this, props);

      return;
    }

    const { latitude, longitude, ...other } = props;
    const boundLatitude = (() => {
      if (latitude > this.boundary.ne.latitude)
        return this.boundary.ne.latitude;
      if (latitude < this.boundary.sw.latitude)
        return this.boundary.sw.latitude;

      return latitude;
    })();

    const boundLongitude = (() => {
      if (longitude > this.boundary.ne.longitude)
        return this.boundary.ne.longitude;
      if (longitude < this.boundary.sw.longitude)
        return this.boundary.sw.longitude;

      return longitude;
    })();

    Object.assign(this, {
      ...other,
      latitude: boundLatitude,
      longitude: boundLongitude,
    });
  };

  /** Resets to initial viewport. */
  reset = () => {
    Object.assign(this, this.initialState);
  };

  zoomIn = () => {
    const exceedsMax = this.zoom + 0.2 > this.maxZoom;

    if (!exceedsMax) this.zoom = this.zoom + 0.2;
  };

  zoomOut = () => {
    const exceedsMin = this.zoom - 0.2 < this.minZoom;

    if (!exceedsMin) this.zoom = this.zoom - 0.2;
  };

  move = (latitude: number, longitude: number) => {
    this.latitude = latitude;
    this.longitude = longitude;
  };
}

interface LatLonMap {
  latitude: number;
  longitude: number;
}
