import * as React from 'react';
import { render as reactRender } from 'react-dom';

import { createEntryComponent } from './root/root';

const Entry = createEntryComponent();
const domEl = document.getElementById('projectRoot');
const render = () => reactRender(<Entry />, domEl);

render();
