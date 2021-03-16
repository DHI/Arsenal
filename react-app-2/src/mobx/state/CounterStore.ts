import { makeAutoObservable } from "mobx";
import { RootStore } from "./RootStore";

export class CounterStore {
  constructor(private root: RootStore) {
    makeAutoObservable(this);
  }

  count = 0;

  incr = () => ++this.count;
  decr = () => --this.count;

  setCount = (count: this["count"]) => (this.count = count);

  get exampleOfAccessingRoot() {
    return this.root.router.route?.key;
  }
}
