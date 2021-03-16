import * as React from "react";
import { render } from "react-dom";
import { RootStore, RootStoreReactContext } from "./state/RootStore";
import { Routes } from "./routing";
import { NavBar } from "./navBar";

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
