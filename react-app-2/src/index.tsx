import * as React from "react";
import { render } from "react-dom";
import { Routes } from "./routing";
import { NavBar } from "./navBar";
import { RootStore, RootStoreReactContext } from "./store";
import "./global.css";

function Root() {
  const [store] = React.useState(() => new RootStore());

  return (
    <RootStoreReactContext.Provider value={store}>
      <NavBar />
      <Routes />
    </RootStoreReactContext.Provider>
  );
}

render(<Root />, document.getElementById("__root"));

if (import.meta.hot) import.meta.hot.accept();