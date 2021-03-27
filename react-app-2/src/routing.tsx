/* eslint-disable react-hooks/rules-of-hooks */
import { createHashHistory } from "history";
import { observer } from "mobx-react-lite";
import * as React from "react";
import { XRoute, XRouter } from "xroute";
import { HomePage, Page2, PageAny } from "./someExamplePages";
import { useStore } from "./__store/root";

export const Routes = observer(() => {
  const {
    router: { route, routes },
  } = useStore();

  const routeComponentMap: { [k in keyof typeof routes]: React.FC } = {
    home: HomePage,
    page2: Page2,
    pageAny: PageAny,
  };

  const MatchingRoute = routeComponentMap[route?.key ?? "home"];

  return <MatchingRoute />;
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
