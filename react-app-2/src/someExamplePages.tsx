import { useStore } from "./__store/root";
import * as React from "react";
import { IS_COUNTER_ENABLED } from "./__config/featureFlags";
import { BasicCounter } from "./__components/basicCounter";
import styled from "@emotion/styled";
import { observer } from "mobx-react-lite";

export const HomePage = observer(() => <>Homepage</>);

export const Page2 = observer(() => {
  const { counter } = useStore();

  return (
    <>
      <p>Page 2 is active</p>
      {IS_COUNTER_ENABLED && <BasicCounter counter={counter} />}
    </>
  );
});

export const PageAny = observer(() => {
  const {
    router: { routes },
    anyPage: { activePage, activePageInteger, setPage },
  } = useStore();

  return (
    <>
      <h3>Page {routes.pageAny.params?.page}</h3>
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
