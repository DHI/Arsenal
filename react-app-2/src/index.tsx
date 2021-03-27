import * as React from "react";
import { render } from "react-dom";
import { Routes } from "./routing";
import { NavBar } from "./navBar";
import { RootStore, StoreReactContext } from "./__store/root";
import "./global.css";

function Root() {
  const [store] = React.useState(() => new RootStore());

  return (
    <StoreReactContext.Provider value={store}>
      <NavBar />
      <Routes />
    </StoreReactContext.Provider>
  );
}

render(<Root />, document.getElementById("__root"));

if (import.meta.hot) import.meta.hot.accept();
