import { useStore } from '../__hooks';
import { observer } from 'mobx-react-lite';
import { XRoute } from 'xroute';
import { NavBar } from '../NavBar';
import { styled } from '__css';

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
      <main>
        <div>
          <p>
            <$FancyButton onClick={() => setPage(activePageInteger - 1)}>
              Back
            </$FancyButton>
            <span>Page {route.pathname?.page}</span>
            <$FancyButton onClick={() => setPage(activePageInteger + 1)}>
              Next
            </$FancyButton>
          </p>
          <div>
            <label>
              Change page (strings) (will error when you dont use a number)
            </label>
            <input
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
