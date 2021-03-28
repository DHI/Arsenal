import { useStore } from "../__store/root";
import * as React from "react";
import styled from "@emotion/styled";
import { observer } from "mobx-react-lite";
import { XRoute } from "xroute";
import { NavBar } from "../navBar";

export const numberedPagesRoute = XRoute(
  "numberedPages",
  "/:language/page/:page(\\d+)",
  {} as { language: string; page: string }
);

export const NumberedPagesRoot = observer(() => {
  const {
    router: {
      routes: {
        numberedPages: { params },
      },
    },
    numberedPages: { activePage, activePageInteger, setPage },
  } = useStore();

  return (
    <>
      <NavBar />
      <h3>Page {params?.page}</h3>
      <p>
        Change page: &nbsp;
        <$FancyButton onClick={() => setPage(activePageInteger - 1)}>
          Back
        </$FancyButton>
        &nbsp; &nbsp;
        <$FancyButton onClick={() => setPage(activePageInteger + 1)}>
          Next
        </$FancyButton>
      </p>
      Change page (strings) (will error when you dont use a number)
      <input value={activePage} onChange={(e) => setPage(e.target.value)} />
      <p></p>
    </>
  );
});

const $FancyButton = styled.button`
  background: #666;
  border: 4px solid green;
  margin: 0.1em;
  border-radius: 3px;
  padding: 0.2em;
  color: white;
  font-weight: 900;

  &:hover {
    color: black;
  }
`;
