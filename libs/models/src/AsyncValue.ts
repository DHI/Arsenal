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
 *
 * @example
 *
 * const v = new AsyncValue(() => fetchUsersList())
 * await v.query() // Don't need to provide params as none are defined
 * v.value // [{ id: 1, name: 'John' }, { id: 2, name: 'Jane' }]
 */
export class AsyncValue<VALUE, PAYLOAD = any> {
  constructor(
    private _query: (payload: PAYLOAD) => Promise<VALUE>,
    private config: {
      value?: VALUE;
      valueAnnotation?: AnnotationMapEntry;
    } = {},
  ) {
    const { value, valueAnnotation = observable } = config;

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

  /** This is just for typescript */
  protected PAYLOAD!: PAYLOAD;

  isPending = false;
  value?: VALUE = undefined;
  error?: Error = undefined;

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

  /** Clones this instance allowing seperate values to be stored with the same configuration */
  clone = () => {
    return new AsyncValue(this._query, this.config);
  };

  /** Sets the value */
  set(value: this['value']) {
    this.value = value;

    return this;
  }

  /** Reset value to undefined */
  reset() {
    this.value = undefined;

    return this;
  }

  setIsPending = (v: this['isPending']) => (this.isPending = v);
  setError = (v: this['error']) => (this.error = v);

  /** Creates an autorun reaction whenever the error changes */
  onError = (cb: (err: this['error']) => void) => autorun(() => cb(this.error));

  /** Creates an autorun reaction whenever the value changes */
  onValue = (cb: (v: this['value']) => void) => autorun(() => cb(this.value));
}

export const AsyncValueModel = AsyncValue