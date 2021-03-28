import * as React from "react";
import { observer } from "mobx-react-lite";
import { NavBar } from "../navBar";
import { XRoute } from "xroute";

export const homePageRoute = XRoute(
  "homePage",
  "/:language?",
  {} as { language?: string }
);

export const HomePageRoot = observer(() => (
  <>
    <NavBar />
    Homepage
  </>
));
