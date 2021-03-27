/* eslint-disable react-hooks/rules-of-hooks */
import { makeAutoObservable } from "mobx";
import { RootStore } from "./root";

export class AnyPageStore {
  constructor(private root: RootStore) {
    makeAutoObservable(this);
  }

  get route() {
    return this.root.router.routes.pageAny;
  }

  get activePage() {
    return this.route.params?.page;
  }

  get activePageInteger() {
    return Number(this.activePage ?? -1);
  }

  setPage = (page: this["activePage"] | number) => {
    if (isNaN(Number(page))) throw new Error("Cant set not number pages!");

    this.route.push({ page: page?.toString() });
  };
}
