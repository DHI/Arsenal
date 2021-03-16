export declare global {
  interface Window {
    // add you custom properties and methods
    store: import("../state/RootStore").RootStore;
  }
}
