import { createContext, useContext, useEffect } from 'react';
import { autorun } from 'mobx';

/** Shortcut to creating a hook for a context */
export function createContextHook<S extends unknown>(
  onEmptyContext?: () => void,
) {
  const Context = createContext<undefined | S>(undefined);

  function use<S2 extends S>() {
    // eslint-disable-next-line
    const context = useContext(Context);

    if (context == null) {
      onEmptyContext?.();
      throw new Error('Missing hook context');
    }

    return context as S2;
  }

  return {
    Context,
    use,
  };
}

/**
 * A useEffect hook with mobx autorun to avoid needing to provide a dependencies array.
 *
 * @note remember to define observable dependneices before halting control flow like the example below.
 * @example
 *
 * useAutorun(() => {
 *   const isActive = some.store.value.isActive
 *   const isAuthorized = some.store.auth.isAuthorized
 *
 *   if (!isActive || !isAuthorized) return
 *
 *   some.store.doStuff()
 * })
 */
export function useAutorun(...params: Parameters<typeof autorun>) {
  return useEffect(() => autorun(...params), []);
}

// export function useMobxClass<CLASS>(fn: () => CLASS)  {
//   return useMemo(() => fn(), []);
// }
