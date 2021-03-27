/* eslint-disable react-hooks/rules-of-hooks */
import { makeAutoObservable } from "mobx";

export class CounterStore {
  constructor() {
    makeAutoObservable(this);
  }

  count = 0;

  incr = () => ++this.count;
  decr = () => --this.count;

  setCount = (count: this["count"]) => (this.count = count);
}
