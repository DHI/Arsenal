/**
 * Create a setter action for a model
 *
 * @example .actions((self) => ({ set: SetterAction(self) }))
 * @example myStore.set({ something: 1 })
 **/
import Debug from 'debug';

export const SetterAction = <S extends unknown>(self: S) => (
  props: Partial<typeof self>, // TODO: take in a MST model type instead of self
) => Object.assign(self, props);

/* eslint-disable @typescript-eslint/no-empty-function */

/**
 * @example
 *
 * const dict = { a: 1, b: 2 } as const;
 * const values = Object.keys(dict).map((key) => {
 *   assumeType<keyof typeof dict>(key)
 *   return dict[key] // No errors because `key` has changed from `'string'` to `'a' | 'b'`
 * })
 */
export function assumeType<T>(x: unknown): asserts x is T {}

Debug.enable(process.env.DEBUG ?? 'fe*');

/** fe = frontend */
export const log = Debug('fe');
export const logger = log;
