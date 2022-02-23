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
  layout?: {
    unit?: string | { position: 'start' | 'end'; value: string };
    /**
     * Defaults to whatever the `schema` infers.
     *
     * Can also be provided to override the schema's default.
     *
     * 'primaryBoolean':
     *   - When this is defined, the parent group can be rendered with a checkbox
     *   - Can only be one of these variants in the group
     *
     * */
    variant?:
      | 'number'
      | 'textarea'
      | 'text'
      | 'date'
      | 'week'
      | 'primaryCheckbox'
      | 'checkbox'
      | 'unlabeledCheckbox'
      | 'rangeSlider'
      | 'primaryText';
    hidden?: boolean;
    disabled?: boolean;
  };
  schema: FormJSONSchema;
}

export interface ComponentField {
  kind: 'component';
  component: string;
}

interface RangeSliderFieldVariant extends Field {
  schema: NumberInputSchema & {
    minimum: number;
    maximum: number;
  };
  layout?: Field['layout'] & {
    variant: 'rangeSlider';
    rangeSlider?: {
      /** @default 'end' */
      valuePosition?: 'end' | 'handle';
      /** @default 100 */
      stepCount?: number;
    };
  };
}

export type FieldVariants = RangeSliderFieldVariant | Field;

export type CollapseOptions = 'initiallyClosed' | 'initiallyOpen' | 'disabled';

/**
 * Field groups's job is to contain a list of fields
 */
export interface FieldGroup {
  kind: 'group';
  name?: string;
  fields: FieldKinds[];
  layout?: {
    collapsing?: CollapseOptions;
    /** @default column */
    direction?: 'column' | 'row';

    /** @default true */
    indentation?: boolean;
  };
}

export type StepperStep = number;

/**
 * A list of steps in a stepper structure
 */
export interface StepperGroup {
  kind: 'stepper';
  id: string;
  steps: {
    name: string;
    fields: FieldKinds[];
  }[];
  layout?: {
    /** @default 0 */
    defaultStep?: StepperStep;
    /** @default true */
    backAndNextButtons?: boolean;
  };
}

/**
 * Special group for handling location picking
 *
 * @deprecated
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

export interface RangeSliderField {
  kind: 'rangeSlider';
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
  layout?: {
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
    collapsing?: CollapseOptions;
    rowCollapsing?: CollapseOptions;
  };
}

export interface ActionFieldGroup {
  kind: 'action';
  id: string;
  label?: string;
}

export type FieldKinds =
  | FieldVariants
  | FieldGroup
  | FieldSetGroup
  | LocationGroup
  | ActionFieldGroup
  | ComponentField;

export type RootFieldKinds = FieldKinds | StepperGroup;

interface BaseInputSchema {
  description?: string;
  default?: any;
}

export interface SelectEnumInputSchema extends BaseInputSchema {
  type: 'string';
  enum: (string | number)[];
}

export interface SelectOneOfInputSchema extends BaseInputSchema {
  type: 'string';
  oneOf: {
    const: string | number;
    /** Used as label */
    description?: string;
  }[];
}

export type SelectInputSchemas = SelectEnumInputSchema | SelectOneOfInputSchema;

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
export interface BooleanInputSchema extends BaseInputSchema {
  type: 'boolean';
}

export type FormJSONSchema =
  | SelectInputSchemas
  | TextInputSchema
  | NumberInputSchema
  | BooleanInputSchema;

export interface FormJSONSchemaError {}

export type LonLat = [longitude: number, latitude: number];
