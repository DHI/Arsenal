/* eslint-disable react-hooks/rules-of-hooks */
import { makeAutoObservable } from 'mobx';

export class CounterStore {
  constructor(public count: number = 0) {
    makeAutoObservable(this);
  }

  incr = () => ++this.count;
  decr = () => --this.count;

  setCount = (count: this['count']) => (this.count = count);
}
