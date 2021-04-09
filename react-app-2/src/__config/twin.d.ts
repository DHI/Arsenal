import 'twin.macro';
import styledImport from 'styled-components';

declare module 'twin.macro' {
  // The styled and css imports
  const styled: typeof styledImport;
  const css: typeof css;
}
