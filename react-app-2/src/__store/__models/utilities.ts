import { observable, makeObservable, action } from "mobx";

/**
 * An easier way to handle simple value getter/setter.
 *
 * @example
 * const selectedFruit = new StateModel<'banana'|'apple'|undefined>(undefined)
 * selectedFruit.set('test') // TS error
 * selectedFruit.set('banana') // Valid
 * selectedFruit.state // 'banana'
 */
export class StateModel<STATE = any> {
  constructor(state: STATE) {
    this.state = state;
    makeObservable(this);
  }

  @observable state: STATE;

  @action set = (state: this["state"]): void => {
    this.state = state;
  };
}

/**
 * @see StateModel
 *
 * An easier way to manage simple boolean state.
 *
 * @example
 * const isActive = new BooleanModel(true)
 * isActive.state // true
 * isActive.toggle() // false
 * isActive.set(true)
 */
export class BooleanModel extends StateModel {
  constructor(public state = false) {
    super(state);
    makeObservable(this);
  }

  @action toggle = () => (this.state = !this.state);
}
