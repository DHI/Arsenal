import { observable, makeObservable, action } from 'mobx';

/**
 * An easier way to handle simple value getter/setter.
 *
 * @example
 * const selectedFruit = new StateModel<'banana'|'apple'|undefined>(undefined)
 * selectedFruit.set('test') // TS error
 * selectedFruit.set('banana') // Valid
 * selectedFruit.value // 'banana'
 */

export class StateModel<STATE = any> {
  constructor(value: STATE) {
    this.value = value;
    makeObservable(this);
  }

  @observable value: STATE;

  @action set = (state: this['value']): void => {
    this.value = state;
  };
}
