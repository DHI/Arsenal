import { createEntryComponent } from './root';
import * as React from 'react';

export default {
  title: 'Root',
};

export const entry = (() => {
  const Entry = createEntryComponent();

  return () => <Entry />;
})();
