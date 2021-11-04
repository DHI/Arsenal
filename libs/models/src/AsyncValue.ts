import {
  action,
  makeObservable,
  observable,
  autorun,
  AnnotationMapEntry,
} from 'mobx';

/**
 * A simple way to encapsulate API access.
 *
 * Read the example closely:
 *
 * @example
 * async function fetchFiles(c: { userId: string; foo: number }): Promise<{ name: string }[]> {
 *   return []
 * }
 *
 * class ExampleModel {
 *   constructor() { makeAutoObservable(this) }
 *   activeUserId = '22'
 *   files = new AsyncValue(async ({ foo }: { foo: number }) =>
 *     fetchFiles({ userId: this.activeUserId, foo })
 *   )
 * }
 *
 * const example = new ExampleModel()
 * example.files.value?.[0]?.name // undefined - missing data
 * await example.files.query({ foo: 22 }) // foo is strongly typed, inferred!
 * example.files.value?.[0]?.name // 'myFile.txt' - has data!
 */
export class AsyncValue<VALUE extends any, PAYLOAD extends any> {
  constructor(
    private _query: (payload: PAYLOAD) => Promise<VALUE>,
    {
      value,
      valueAnnotation = observable,
    }: {
      value?: VALUE;
      valueAnnotation?: AnnotationMapEntry;
    } = {},
  ) {
    this.value = value;

    makeObservable(this, {
      value: valueAnnotation,
      isPending: observable,
      error: observable,
      query: action.bound,
      set: action.bound,
      reset: action.bound,
      setError: action.bound,
      setIsPending: action.bound,
    });
  }

  value?: VALUE = undefined;
  isPending = false;
  error?: Error = undefined;

  set(value: this['value']) {
    this.value = value;

    return this;
  }

  reset() {
    this.value = undefined;

    return this;
  }

  onError(cb: (err: this['error']) => void) {
    return autorun(() => cb(this.error));
  }

  onValue(cb: (v: this['value']) => void) {
    return autorun(() => cb(this.value));
  }

  /**
   * @example
   * // Valid usage:
   * new AsyncValue((foo: number) => {}).query(22222222)
   * new AsyncValue((foo: { a: number }) => {}).query({ a: 222222})
   * new AsyncValue(() => {}).query()
   */
  async query<P extends PAYLOAD extends {} ? [PAYLOAD] : undefined[]>(
    ...[payload]: P
  ) {
    this.setIsPending(true);
    this.setError(undefined);

    try {
      const val = await this._query(payload as any);

      this.set(val);
    } catch (err: any) {
      this.setError(err);
    }

    this.setIsPending(false);

    return this;
  }

  setIsPending(v: this['isPending']) {
    this.isPending = v;
  }

  setError(v: this['error']) {
    this.error = v;
  }
}
