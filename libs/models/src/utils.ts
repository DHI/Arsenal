import { autorun, toJS } from 'mobx';

/** Creates reactions for each property of an object and returns a single disposer for all */
export function onPropChanges<V extends {}, K extends keyof V>(
  obj: V,
  onChange: (key: K, v: V[K]) => void,
) {
  const observables = { ...obj };
  const disposers = Object.keys(observables).map((key) =>
    autorun(() => onChange(key as K, obj[key as K])),
  );

  return () => disposers.forEach((d) => d());
}

/** Uses onPropChanges to console.log when any property is updated on an observable object */
export function logPropChanges<V extends {}>(value: V, ...headers: string[]) {
  let last = Date.now();

  return onPropChanges(value, (key, value) => {
    const now = Date.now();
    const timeAgo = `+${now - last}ms`;

    last = now;

    console.log(...headers, timeAgo, { [key]: toJS(value) });
  });
}
