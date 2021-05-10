import { observer } from 'mobx-react-lite';
import { useStore } from './__store/root';
import * as React from 'react';
import { css, cx, styled } from '__css';

export const NavBar = observer(() => {
  const {
    router: { routes },
    numberedPages,
  } = useStore();

  return (
    <>
      <div
        css={css`
          height: 60px;
        `}
      />
      <$NavBar>
        <$Link
          href={`#${routes.homePage.toUri({})}`}
          // Set active class for styled $Link to handle
          className={cx({ active: routes.homePage.isActive })}
        >
          Home
        </$Link>
        <$Link
          href={`#${routes.numberedPages.toUri({
            pathname: {
              language: 'en',
              page: '1',
            },
          })}`}
          className={cx({ active: routes.numberedPages.isActive })}
        >
          Page By Number ({numberedPages.activePage ?? 'None'})
        </$Link>
        <$Link
          onClick={() =>
            routes.brisbaneMap.push({ pathname: { language: 'en' } })
          }
          className={cx({ active: routes.brisbaneMap.isActive })}
        >
          Brisbane Map
        </$Link>
      </$NavBar>
    </>
  );
});

const $Link = styled.a`
  border: 2px solid #aaa;
  margin: 0.3em;
  padding: 0.5em 1em;
`;

const $NavBar = styled.main`
  box-shadow: 0 3px 7px #0008;
  background: #000a;
  position: fixed;
  display: flex;
  top: 0;
  left: 0;
  z-index: 10;
  width: 100%;
  justify-content: center;
  align-items: center;
  background: #0008;
`;
