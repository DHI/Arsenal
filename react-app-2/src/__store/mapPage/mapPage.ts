import { makeAutoObservable } from "mobx";
import { RootStore } from "../root";

export class MapPageStore {
  constructor(private root: RootStore) {
    makeAutoObservable(this);
  }

  get layers() {
    return [];
  }
}
