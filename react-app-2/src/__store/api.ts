import { makeAutoObservable } from "mobx";
import { RootStore } from "./root";

export class ApiStore {
  constructor(private root: RootStore) {
    makeAutoObservable(this);
  }

  // https://countries-274616.ew.r.appspot.com/?query=query%20%7B%0A%09Country%20%7B%0A%20%20%20%20name%0A%20%20%20%20%23%20check%20the%20docs%20for%20more%20info%0A%20%20%7D%0A%7D%0A
  // countries = AsyncValue(() => )
}
