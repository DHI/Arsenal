/* eslint-disable react-hooks/rules-of-hooks */
import { makeAutoObservable } from 'mobx';
import { RootStore } from './root';

/**
 * A basic store to hold state for a page
 * which supports an infinite number of numbered pages.
 */
export class NumberedPagesStore {
  constructor(private root: RootStore) {
    makeAutoObservable(this);
  }

  get route() {
    return this.root.router.routes.numberedPages;
  }

  get activePage() {
    return this.route.pathname?.page;
  }

  get activePageInteger() {
    return Number(this.activePage ?? -1);
  }

  setPage = (page: this['activePage'] | number) => {
    if (isNaN(Number(page)))
      throw new Error(`${page} must be a number or undefined.`);

    this.route.push({ pathname: { page: page?.toString() } });
  };
}
