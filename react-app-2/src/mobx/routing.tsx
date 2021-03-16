import { createHashHistory } from "history";
import { observer } from "mobx-react-lite";
import * as React from "react";
import { XRoute, XRouter } from "xroute";
import { RootStore } from "./state/RootStore";
import { Counter } from "./__components/counter";

/** Root router for the app */
export const Routes = observer(() => {
  const {
    router: { routes, route },
    counter,
  } = RootStore.use();

  const components = {
    home() {
      return <>Home</>;
    },
    page2() {
      return (
        <>
          <p>Page 2 is active</p>
          <Counter counter={counter} />
        </>
      );
    },
    pageAny() {
      return <>Page any {routes.pageAny.params?.page} is active</>;
    },
  };

  const Component = components[route?.key ?? "home"];

  return <Component />;
});

export function createRouter() {
  return new XRouter(
    [
      XRoute("home", "/:language?", {} as { language?: string }),
      XRoute(
        "page2",
        "/:language/:page(2)",
        {} as { language: string; page: "2" }
      ),
      XRoute(
        "pageAny",
        "/:language/:page",
        {} as { language: string; page: string }
      ),
    ],
    createHashHistory()
  );
}
