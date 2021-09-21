import { makeObservable, action, computed } from 'mobx';
import { StateModel } from './StateModel';

/**
 * @see StateModel
 *
 * An easier way to manage simple boolean state.
 *
 * @example
 * const isActive = new BooleanModel(true)
 * isActive.value // true
 * isActive.toggle() // false
 * isActive.set(true)
 * isActive.isTrue // true
 * isActive.setFalse()
 * isActive.isFalse // true
 */

export class BooleanModel extends StateModel {
  constructor(public value = false) {
    super(value);
    makeObservable(this);
  }

  @computed get isTrue() {
    return !!this.value;
  }

  @computed get isFalse() {
    return !this.isTrue;
  }

  @action.bound toggle() {
    return (this.value = !this.value);
  }

  @action.bound setFalse() {
    this.value = false;
  }

  @action.bound setTrue() {
    this.value = true;
  }
}
