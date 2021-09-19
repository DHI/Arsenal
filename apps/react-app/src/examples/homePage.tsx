import * as React from 'react';
import { observer } from 'mobx-react-lite';
import { NavBar } from '../navBar';
import { XRoute } from 'xroute';

export const homePageRoute = XRoute(
  'homePage',
  '/:language?',
  {} as { pathname: { language?: string }; search: {} },
);

export const HomePageRoot = observer(() => (
  <>
    <NavBar />
    <p>Homepage</p>
  </>
));
