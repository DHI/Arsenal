import { makeAutoObservable } from 'mobx';

/**
 * NOTE: features must have a unique `id` field!
 *
 * @example
 * // How to wire up to a layer:
 * new GeoJsonLayer({
 *   onHover: hoverEvent.set,
 *   onClick: clickEvent.set,
 * })
 *
 * // How to use in a tooltip:
 * <Tooltip isHidden={!hoverEvent.isActive}>{hoverEvent.properties?.title}</Tooltip>
 */
export class MapLayerEventModel<
  DATUM extends { id?: string | number; properties?: {} }
> {
  constructor() {
    makeAutoObservable(this);
  }

  id?: string | number = undefined;
  properties?: DATUM['properties'] = undefined;
  x?: number = undefined;
  y?: number = undefined;

  get isActive() {
    return !!this.id;
  }

  set = (pickInfo: undefined | { object?: DATUM; x?: number; y?: number }) => {
    if (!pickInfo?.object?.id) return this.reset();

    const { object, x, y } = pickInfo;
    const { id, properties } = object ?? {};

    this.id = id;
    this.properties = properties;
    this.x = x;
    this.y = y;
  };

  reset = () => {
    this.id = undefined;
    this.properties = undefined;
    this.x = undefined;
    this.y = undefined;
  };
}
