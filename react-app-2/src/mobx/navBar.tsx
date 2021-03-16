import { observer } from "mobx-react-lite";
import { RootStore } from "./state/RootStore";
import * as React from "react";
import { css } from "@emotion/css";

export const NavBar = observer(() => {
  const { router } = RootStore.use();
  const height = 50;

  return (
    <>
      <div
        className={css`
          height: ${height}px;
        `}
      />
      <main
        className={css`
          position: absolute;
          top: 0;
          left: 0;
          height: ${height}px;
          width: 100%;
          display: flex;
          align-items: center;
          padding: 0.2em 1em;

          a {
            display: inline-block;
            margin-right: 1em;
            color: #5da9e7;
            border: 1px solid #6a8eaf44;
          }
        `}
      >
        <a href={`#${router.routes.home.toPath()}`}>Home</a>
        <a
          href={`#${router.routes.page2.toPath({ language: "en", page: "2" })}`}
        >
          Page2
        </a>
        <a
          href={`#${router.routes.pageAny.toPath({
            language: "en",
            page: "3",
          })}`}
        >
          Page 3
        </a>
        <button
          onClick={(e) => {
            e.preventDefault();

            router.routes.pageAny.push({ page: "4", language: "foo" });
          }}
        >
          Page 4
        </button>
      </main>
    </>
  );
});
