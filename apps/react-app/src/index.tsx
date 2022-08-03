import './global.css';
import { createRoot } from 'react-dom/client';
import { Root } from './Root';

const container = document.getElementById('__root')!;
const rootNode = createRoot(container);

rootNode.render(<Root />);
