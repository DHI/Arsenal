import { observer } from "mobx-react-lite";
import { useStore } from "./store";
import * as React from "react";
import { css } from "@emotion/css";

export const NavBar = observer(() => {
  const {
    router: { routes },
  } = useStore();
  const height = 50;

  console.log({ routes });

  return (
    <>
      <div
        className={css`
          height: ${height}px;
        `}
      />
      <main
        className={
          "absolute flex top-0 left-0 flex-grow items-center p-1 py-2 " +
          css`
            height: ${height}px;

            a {
              display: inline-block;
              margin-right: 1em;
              color: #5da9e7;
            }
          `
        }
      >
        <a
          href={`#${routes.home.toPath()}`}
          className={`${routes.home.isActive ? "border-2 border-red-800" : ""}`}
        >
          Home
        </a>
        <a
          href={`#${routes.page2.toPath({ language: "en", page: "2" })}`}
          className={`${
            routes.page2.isActive ? "border-4 border-blue-800" : ""
          }`}
        >
          Page2
        </a>
        <a
          href={`#${routes.pageAny.toPath({
            language: "en",
            page: "3",
          })}`}
          className={`${
            routes.pageAny.isActive ? "border-4 border-green-800" : ""
          }`}
        >
          Page 3
        </a>
        <button
          onClick={(e) => {
            e.preventDefault();

            routes.pageAny.push({ page: "4", language: "foo" });
          }}
          className={`${
            routes.pageAny.isActive ? "border-4 border-green-800" : ""
          }`}
        >
          Page 4
        </button>
      </main>
    </>
  );
});
