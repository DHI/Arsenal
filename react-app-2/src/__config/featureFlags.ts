export const REACT_ENV = window.REACT_ENV;

// Compatibility with Vite/Snowpack
(import.meta as any).env = REACT_ENV;

export const IS_COUNTER_ENABLED = REACT_ENV.REACT__COUNTER_ENABLED === 'true';

console.table(REACT_ENV);

console.table({
  IS_COUNTER_ENABLED,
});
