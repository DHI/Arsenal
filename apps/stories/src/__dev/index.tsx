import { createRoot } from 'react-dom/client';
import 'vite/types/importMeta.d';
import { Root } from './Root';

createRoot(document.getElementById('__root')!).render(<Root />);
