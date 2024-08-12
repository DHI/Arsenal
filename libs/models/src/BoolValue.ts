import { makeObservable, action, computed, observable } from 'mobx';
import { Value } from './Value';

/**
 * @see Value
 *
 * An easier way to manage simple boolean state.
 *
 * @example
 * const isActive = new BoolValue(true)
 * isActive.value // true
 * isActive.toggle() // false
 * isActive.set(true)
 * isActive.isTrue // true
 * isActive.setFalse()
 * isActive.isFalse // true
 */
export class BoolValue implements Value<boolean> {
  constructor(public value = false) {
    makeObservable(this, {
      isFalse: computed,
      isTrue: computed,
      setFalse: action.bound,
      setTrue: action.bound,
      toggle: action.bound,
      value: observable,
      set: action.bound,
    });
  }

  get isTrue() {
    return !!this.value;
  }

  get isFalse() {
    return !this.isTrue;
  }

  toggle() {
    return (this.value = !this.value);
  }

  setFalse() {
    this.value = false;
  }

  setTrue() {
    this.value = true;
  }

  set(state: this['value']): void {
    this.value = state;
  }
}

export {
  BoolValue as BooleanModel,
  BoolValue as BooleanValueModel,
  BoolValue as BooleanValue,
};
