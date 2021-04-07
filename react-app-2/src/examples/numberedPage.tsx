import { useStore } from '../__store/root';
import * as React from 'react';
import { observer } from 'mobx-react-lite';
import { XRoute } from 'xroute';
import { NavBar } from '../navBar';
import { styled } from 'twin.macro';

export const numberedPagesRoute = XRoute(
  'numberedPages',
  '/:language/page/:page(\\d+)?',
  {} as {
    pathname: { language: string; page?: string };
    search: { page?: string };
  },
);

export const NumberedPagesRoot = observer(() => {
  const {
    router: {
      routes: { numberedPages: route },
    },
    numberedPages: { activePage, activePageInteger, setPage },
  } = useStore();

  return (
    <>
      <NavBar />
      <main tw="flex justify-center p-4 pt-8">
        <div tw="max-w-md">
          <p tw="mb-8 flex w-full justify-center items-center">
            <$FancyButton onClick={() => setPage(activePageInteger - 1)}>
              Back
            </$FancyButton>
            <span tw="p-4">Page {route.pathname?.page}</span>
            <$FancyButton onClick={() => setPage(activePageInteger + 1)}>
              Next
            </$FancyButton>
          </p>
          <div tw="flex items-center">
            <label tw="my-4 text-sm italic opacity-70 w-6/12">
              Change page (strings) (will error when you dont use a number)
            </label>
            <input
              tw="w-6/12 py-1 px-4 h-10 "
              value={activePage}
              onChange={(e) => setPage(e.target.value)}
            />
          </div>
          <p></p>
        </div>
      </main>
    </>
  );
});

const $FancyButton = styled.button`
  background: #666;
  border: 4px solid #3f683f;
  margin: 0.1em;
  border-radius: 3px;
  padding: 0.1em 0.5em;
  color: white;
  font-weight: bold;
  margin: 0.1em;
`;
