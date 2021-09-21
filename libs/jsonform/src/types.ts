export function ofType<T extends unknown>() {
  return <X extends T>(v: X) => v;
}

export interface FormConfig {
  fields: RootFieldKinds[];
}

/**
 * A field is an input of some kind,
 * which is derived from the schema.
 *
 * Supported input types:
 * - Text
 *   - Min/max length
 *   - Regex patterns
 * - Number
 *   - Min/max
 * - Select
 *   - Choose one of an enum
 * - Multi Select
 *   - Choose many of an enum
 *
 */
export interface Field {
  kind: 'field';
  /** JSON Pointer */
  pointer: string;
  name: string;
  /** The value's unit eg. 88 mg/l */
  unit?: string | { position: 'start' | 'end'; value: string };
  /** Defaults to whatever the `schema` infers */
  variant?: 'number' | 'textarea' | 'text' | 'date' | 'week';
  schema: FormJSONSchema;
}

/**
 * Field groups's job is to contain a list of fields
 */
export interface FieldGroup {
  kind: 'group';
  name?: string;
  fields: FieldKinds[];
}

export type StepperStep = number;

/**
 * A list of steps in a stepper structure
 */
export interface StepperGroup {
  kind: 'stepper';
  id: string;
  /** @default 0 */
  defaultStep?: StepperStep;
  /** @default true */
  backAndNextButtons?: boolean;
  steps: {
    name: string;
    fields: FieldKinds[];
  }[];
}

/**
 * Special group for handling location picking
 */
export interface LocationGroup {
  kind: 'location';
  location: {
    /** Longitude */
    x: Field;
    /** Latitude */
    y: Field;
  };
  canPick?: boolean;
  canGoto?: boolean;
}

/**
 * Field sets are groups of fields which come as a set within a list.
 * Functionalty:
 * - Append a new set with default values
 * - Remove a set
 */
export interface FieldSetGroup {
  kind: 'set';
  id?: string; // TODO: remove?
  name?: string;
  /** All fields in `fields` are relative to this pointer (by array index) */
  pointer: string;
  fields: FieldKinds[];
  /**
   * @default true
   * When true, can create a new set with default values, adding it to start of list
   */
  canCreate?: boolean;
  /**
   * @default true
   * When true, a set can be removed from list
   */
  canDelete?: boolean;
}

export type FieldKinds = FieldGroup | FieldSetGroup | Field | LocationGroup;

export type RootFieldKinds = FieldKinds | StepperGroup;

interface BaseInputSchema {
  description?: string;
  default?: any;
}

export interface SelectInputSchema extends BaseInputSchema {
  type: 'string';
  enum: (string | number)[];
}

export interface MultiSelectInputSchema extends BaseInputSchema {
  type: 'array';
  items: SelectInputSchema[];
}

export interface TextInputSchema extends BaseInputSchema {
  type: 'string';
  pattern?: string;
  minLength?: number;
  maxLength?: number;
}

export interface NumberInputSchema extends BaseInputSchema {
  type: 'number';
  minimum?: number;
  maximum?: number;
}

export type FormJSONSchema =
  | SelectInputSchema
  | MultiSelectInputSchema
  | TextInputSchema
  | NumberInputSchema;

export interface FormJSONSchemaError {}

export type LonLat = [longitude: number, latitude: number];
