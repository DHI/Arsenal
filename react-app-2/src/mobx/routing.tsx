import { createHashHistory } from "history";
import { observer } from "mobx-react-lite";
import * as React from "react";
import { XRoute, XRouter } from "xroute";
import { useStore } from "./state/RootStore";
import { Counter } from "./__components/counter";
import { IS_COUNTER_ENABLED } from "./__config/features";

const components = {
  home() {
    return <>Home</>;
  },
  page2() {
    const { counter } = useStore();

    return (
      <>
        <p>Page 2 is active</p>
        {IS_COUNTER_ENABLED && <Counter counter={counter} />}
      </>
    );
  },
  pageAny() {
    const {
      router: { routes },
    } = useStore();

    return <>Page any {routes.pageAny.params?.page} is active</>;
  },
};

/** Root router for the app */
export const Routes = observer(() => {
  const {
    router: { route },
  } = useStore();

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
