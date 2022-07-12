import { camelCase } from 'lodash-es';

export function normalizeJobStatusData(input: any): any {
  const data = keysToCamelCase(input) as any;

  return {
    ...data,
    status: data.status?.toUpperCase(),
  };
}

function keysToCamelCase(obj: {}) {
  return Object.fromEntries(
    Object.entries(obj).map(([k, v]) => [camelCase(k), v]),
  );
}
