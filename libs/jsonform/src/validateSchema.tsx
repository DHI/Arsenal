import { Schema } from 'ajv'
import { schemas } from './FormConfigEditor'


export function validateSchema(schema: Schema, value: any) {
  const validate = schemas.compile(schema)
  const isValid = validate(value)

  return { isValid, errors: validate.errors }
}
