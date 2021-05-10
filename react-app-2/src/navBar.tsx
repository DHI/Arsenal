import { observer } from 'mobx-react-lite';
import { useStore } from './__store/root';
import * as React from 'react';
import styled from 'styled-components';
import cn from 'clsx';

export const NavBar = observer(() => {
  const {
    router: { routes },
    numberedPages,
  } = useStore();

  return (
    <>
      <div />
      <$NavBar>
        <$Link
          href={`#${routes.homePage.toUri({})}`}
          // Set active class for styled $Link to handle
          className={cn({ active: routes.homePage.isActive })}
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
          className={cn({ active: routes.numberedPages.isActive })}
        >
          Page By Number ({numberedPages.activePage ?? 'None'})
        </$Link>
        <$Link
          onClick={() =>
            routes.brisbaneMap.push({ pathname: { language: 'en' } })
          }
          className={cn({ active: routes.brisbaneMap.isActive })}
        >
          Brisbane Map
        </$Link>
      </$NavBar>
    </>
  );
});

const $Link = styled.a``;

const $NavBar = styled.main`
  box-shadow: 0 3px 7px #0008;
  background: #000a;
`;
