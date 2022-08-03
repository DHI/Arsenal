const env = import.meta.env;

export const IS_COUNTER_ENABLED = env.REACT__COUNTER_ENABLED === 'true';

console.table({
  IS_COUNTER_ENABLED,
});
