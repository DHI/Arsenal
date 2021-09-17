import { action, observable } from 'mobx';

/**
 * An experimental but simple way to encapsulate API access.
 *
 * Read the example closely:
 *
 * @example
 * type ExampleFile = { name: string }
 * async function fetchFiles(c: { userId: string; foo: number }): Promise<ExampleFile[]> {
 *   return []
 * }
 * class ExampleModel {
 *   constructor() { makeAutoObservable(this) }
 *   activeUserId = '22'
 *   files = new AsyncValue(async ({ foo }: { foo: number }) =>
 *     fetchFiles({ userId: this.activeUserId, foo })
 *   )
 * }
 * const example = new ExampleModel()
 * example.files.value?.[0]?.name // undefined - missing data
 * await example.files.query({ foo: 22 }) // foo is strongly typed, inferred!
 * example.files.value?.[0]?.name // ExampleFile[] - has data!
 */
export class AsyncValue<VALUE extends any, PAYLOAD extends undefined | {}> {
  constructor(
    private _query: (payload: PAYLOAD) => Promise<VALUE>,
    value?: VALUE,
  ) {
    this.value = value;
  }

  @observable value?: VALUE = undefined;
  // TODO: add isLoading
  // TODO: add error
  // see gqless/graphql-state-react for interfaces to make standard with.

  @action.bound set(value: this['value']) {
    return (this.value = value);
  }

  @action.bound async query(payload: PAYLOAD) {
    return this.set(await this._query(payload));
  }
}
