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
export class MapEventModel<
  DATUM extends { id?: string | number; properties?: {} },
> {
  constructor(private config: { ignoreId?: boolean } = {}) {
    makeAutoObservable(this);
  }

  id?: string | number = undefined;
  properties?: DATUM['properties'] = undefined;
  coordinate?: [number, number] = undefined;
  x?: number = undefined;
  y?: number = undefined;

  get isActive() {
    return !!this.id;
  }

  set = (pickInfo?: {
    object?: DATUM;
    x?: number;
    y?: number;
    coordinate?: any;
  }) => {
    if (this.config.ignoreId !== true && !pickInfo?.object) return this.reset();

    const { object, coordinate, x, y } = pickInfo ?? {};
    const { id, properties } = object ?? {};

    this.id = id;
    this.properties = properties;
    this.coordinate = coordinate;
    this.x = x;
    this.y = y;
  };

  reset = () => {
    this.id = undefined;
    this.properties = undefined;
    this.coordinate = undefined;
    this.x = undefined;
    this.y = undefined;
  };
}
