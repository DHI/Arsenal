import { BooleanModel } from '@dhi/arsenal.models';
import { css } from '@emotion/react';
import { Alert, Button, Grid } from '@mui/material';
import Ajv from 'ajv';
import { JsonPointer } from 'json-ptr';
import cloneDeep from 'lodash-es/cloneDeep';
import { makeAutoObservable, runInAction, toJS } from 'mobx';
import { observer } from 'mobx-react-lite';
import { deepObserve } from 'mobx-utils';
import * as React from 'react';
import { ConfirmDropdown } from './components/dropdowns';
import { DiscardIcon, SaveIcon } from './components/icons';
import { FormField, validateSchema, walkFormData } from './FormField';
import {
  ActionFieldGroup,
  Field,
  FormConfig,
  LonLat,
  StepperGroup,
  StepperStep,
} from './types';

type Data = Record<string, any>;
type LocationPickReaction = (
  startLonLat: undefined | LonLat,
  onReaction: (coords: LonLat) => any,
) => void;

export const schemas = new Ajv();

export class FormConfigEditorState {
  constructor(public data: Data, public form: FormConfig) {
    this.setData(data);
    this.setForm(form);
    makeAutoObservable(this);
  }

  isDataDirty = new BooleanModel(false);
  stepperGroups = new Map<StepperGroup['id'], StepperStep>();
  fieldValidation = new Map<
    JsonPointer['pointer'],
    ReturnType<typeof validateSchema>
  >();

  validationTimers = new Map<
    JsonPointer['pointer'],
    ReturnType<typeof setTimeout>
  >();

  get validationErrorsCount() {
    return [...this.fieldValidation.values()].reduce(
      (a, v) => (v.errors ? a + 1 : a),
      0,
    );
  }

  get hasValidationErrors() {
    return this.validationErrorsCount > 0;
  }

  setStepper = (stepperId: StepperGroup['id'], step: StepperStep) => {
    this.stepperGroups.set(stepperId, step);
  };

  setData = (d: this['data']) => {
    this.data = cloneDeep(toJS(d));
    this.isDataDirty.setFalse();
  };

  setForm = (f: this['form']) => {
    this.form = cloneDeep(toJS(f));
  };

  setInData = (fn: (draft: this['data']) => any) => {
    this.isDataDirty.setTrue();
    runInAction(() => fn(this.data));
  };

  addValidationToField = ({
    field,
    pointer,
    value,
  }: {
    field: Field;
    pointer: JsonPointer;
    value: any;
  }) => {
    const details = validateSchema(field.schema, value);

    this.fieldValidation.set(pointer.pointer, details);
  };

  validateEntireForm() {
    this.clearValidation();

    walkFormData({
      form: this.form,
      data: this.data,
      onField: (pointer, field) => {
        this.addValidationToField({
          field,
          pointer,
          value: pointer.get(this.data),
        });
      },
    });
  }

  clearValidation = () => {
    this.fieldValidation.clear();
  };

  /** Sets and validate a field with a debounce delay */
  setField = ({
    field,
    pointer,
    value,
    delay = 1000,
  }: {
    field: Field;
    pointer: JsonPointer;
    value: any;
    delay?: number;
  }) => {
    pointer.set(this.data, value, true);

    clearTimeout(this.validationTimers.get(pointer.pointer)!);

    this.validationTimers.set(
      pointer.pointer,
      setTimeout(() => {
        this.addValidationToField({ field, pointer, value });
      }, delay),
    );
  };
}

type ActionKey = string;

export interface Operations {
  onPickingLocation?: LocationPickReaction;
  onGotoLocation?(latLon: LonLat): void;
  onSave?(data: Data): void;
  onDiscard?(): void;
  onAction?(action: ActionFieldGroup, context?: { parent: JsonPointer }): void;
}

export const FormConfigEditor = observer<{
  data: Data;
  form: FormConfig;
  operations?: Operations;
  onData?(data: FormConfigEditorState['data']): void;
  onInit?(state: FormConfigEditorState): void;
  components?: {
    // textField: React.Component
    saveButton?: {
      text?: React.ReactNode;
    };
    discardButton?: {
      text?: React.ReactNode;
    };
  };
  className?: string;
}>(({ data, form, onInit, onData, operations, components = {}, className }) => {
  const [state] = React.useState(() => new FormConfigEditorState(data, form));

  React.useEffect(() => {
    state.setData(data);
  }, [data]);

  React.useEffect(() => {
    state.setForm(form);
  }, [form]);

  React.useEffect(() => {
    if (!onData) return;

    return deepObserve(state.data, () => {
      onData(toJS(state.data));
    });
  }, [state.data]);

  React.useEffect(() => {
    onInit?.(state);
  }, [state]);

  return (
    <Grid item {...{ className }}>
      {form.fields.map((f, i) => (
        <FormField
          key={f.kind + i}
          field={f}
          state={state}
          operations={operations}
        />
      ))}
      <Grid container>
        {state.hasValidationErrors && (
          <Alert
            severity="error"
            css={css`
              opacity: 0.5;
              flex-grow: 1;
              padding: 0px;
              padding-left: 1.5rem;
            `}
          >
            {state.validationErrorsCount} issues found
          </Alert>
        )}
      </Grid>
      <Grid
        container
        css={css`
          flex-grow: 1;
          justify-content: space-between;
          padding: 1em 1.5em;
          box-shadow: 0 -2px 3px 0 #0002, 0 1px 1px 0 #0001;
          position: relative;
        `}
      >
        <div>
          <ConfirmDropdown
            trigger={{
              button: {
                variant: 'outlined',
              },
              icon: <DiscardIcon fontSize="small" />,
              label: <>{components.discardButton?.text || 'Discard'}</>,
            }}
            confirm={{
              icon: <DiscardIcon />,
              label: <>{components.discardButton?.text || 'Discard'}</>,
              onClick() {
                operations?.onDiscard?.();
              },
            }}
          />
          <Button
            color="primary"
            variant="outlined"
            endIcon={<SaveIcon fontSize="small" />}
            onClick={() => {
              state.validateEntireForm();

              if (state.hasValidationErrors) return;

              operations?.onSave?.(state.data);
            }}
            disabled={state.hasValidationErrors}
          >
            {components.saveButton?.text || 'Save'}
          </Button>
        </div>
      </Grid>
    </Grid>
  );
});

type StyledProps = {
  theme?: {
    palette?: {
      mode: 'light' | 'dark';
    };
  };
};
