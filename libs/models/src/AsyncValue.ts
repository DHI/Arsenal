import { action, makeObservable, observable } from 'mobx';
import { Annotation } from 'mobx/dist/internal';

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
export class AsyncValue<VALUE extends any, PAYLOAD extends undefined | {}> {
  constructor(
    private _query: (payload: PAYLOAD) => Promise<VALUE>,
    {
      initialValue,
      valueAnnotation = observable,
      onError,
    }: {
      initialValue?: VALUE;
      valueAnnotation?: Annotation;
      onError?: AsyncValue<VALUE, PAYLOAD>['onError'];
    } = {},
  ) {
    this.value = initialValue;
    this.onError = onError;

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
  onError?(err: Error): void;

  set(value: this['value']) {
    this.value = value;

    return this;
  }

  reset() {
    this.value = undefined;

    return this;
  }

  async query(payload: PAYLOAD) {
    this.setIsPending(true);
    this.setError(undefined);

    try {
      const val = await this._query(payload);

      this.set(val);

      return this;
    } catch (err: any) {
      this.onError?.(err);
      this.setError(err);

      return this;
    } finally {
      this.setIsPending(false);
    }
  }

  setIsPending(x: this['isPending']) {
    this.isPending = x;
  }

  setError(x: this['error']) {
    this.error = x;
  }
}
