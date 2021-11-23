import { Field, FieldKinds, RootFieldKinds } from './types';
import { JsonPointer } from 'json-ptr';

export function extractScaffoldFromFields(
  fields: RootFieldKinds[] | FieldKinds[],
) {
  function walk(field: RootFieldKinds, parent: JsonPointer) {
    switch (field.kind) {
      case 'group': {
        field.fields.forEach((f) => walk(f, parent));
        break;
      }

      case 'set': {
        const pointer = parent.concat(field.pointer);

        try {
          JsonPointer.set(scaffold, pointer, [], true);
          field.fields.forEach((f) => walk(f, pointer));
        } catch (e: any) {
          console.error(e);

          console.error({ scaffold, pointer });
        }

        break;
      }

      case 'location': {
        walk(field.location.x, parent);
        walk(field.location.y, parent);

        break;
      }

      case 'stepper': {
        field.steps.forEach((s) => {
          s.fields.forEach((f) => walk(f, parent));
        });

        break;
      }

      case 'field': {
        const pointer = parent.concat(field.pointer);
        const value = deriveFieldDefaultValue(field);

        try {
          JsonPointer.set(scaffold, pointer, value, true);
        } catch (e: any) {
          console.error(e);

          console.error({ scaffold, pointer, value });
        }
      }
    }
  }

  const scaffold = {};

  fields.forEach((f) => walk(f, new JsonPointer([])));

  return scaffold;
}

function deriveFieldDefaultValue(field: Field) {
  if (field.schema?.default) return field.schema.default;
  if (field.schema?.type === 'string') return '';
  if (field.schema?.type === 'number') return field.schema.minimum ?? 0;

  return null;
}
