import { JsonPointer } from 'json-ptr'
import {
  Field, FormConfig,
  RootFieldKinds
} from './types'


export function walkFormData({
  onField, form, data,
}: {
  data: {}
  form: FormConfig
  onField(pointer: JsonPointer, field: Field): void
}) {
  function walk(field: RootFieldKinds, parent: JsonPointer) {
    switch (field.kind) {
      case 'group': {
        field.fields.forEach((f) => walk(f, parent))

        return
      }

      case 'set': {
        const pointer = parent.concat(field.pointer)
        const listData = (pointer.get(data) ?? []) as any[]

        listData.forEach((_, index) => {
          field.fields.forEach((f) => {
            walk(f, pointer.concat([index.toString()]))
          })
        })

        return
      }

      case 'location': {
        walk(field.location.x, parent)
        walk(field.location.y, parent)

        return
      }

      case 'stepper': {
        field.steps.forEach((s) => {
          s.fields.forEach((f) => walk(f, parent))
        })

        return
      }

      case 'field': {
        const pointer = parent.concat(field.pointer)

        onField(pointer, field)
      }
    }
  }

  return form.fields.forEach((f) => walk(f, new JsonPointer([])))
}
