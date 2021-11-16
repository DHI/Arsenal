import { observer } from 'mobx-react-lite';
import * as React from 'react';
import {
  ActionFieldGroup,
  Field,
  FieldKinds,
  FormConfig,
  LonLat,
  RootFieldKinds,
  StepperGroup,
  StepperStep,
} from './types';
import { makeAutoObservable, runInAction, toJS } from 'mobx';
import { BooleanModel } from '@dhi/arsenal.models';
import { css, PropsOf } from '@emotion/react';
import styled from '@emotion/styled';
import cloneDeep from 'lodash-es/cloneDeep';
import { JsonPointer } from 'json-ptr';
import { StepperForm } from './components/StepperForm';
import isArray from 'lodash-es/isArray';
import {
  TextField,
  Grid,
  Button,
  ButtonGroup,
  Tooltip,
  MenuItem,
  Select,
  FormControl,
  FormHelperText,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Alert,
  useTheme,
  Switch,
  FormControlLabel,
  Collapse,
} from '@mui/material';
import Ajv, { Schema } from 'ajv';
import { pascalCase } from 'change-case';
import { deepObserve } from 'mobx-utils';
import { ConfirmDropdown } from './components/dropdowns';
import {
  DiscardIcon,
  SaveIcon,
  AddBoxIcon,
  RoomIcon,
  LocationSearchingIcon,
  ExpandMoreIcon,
} from './components/icons';
import pluralize from 'pluralize';
import { ReactNode, useMemo } from 'react';

type Data = Record<string, any>;
type LocationPickReaction = (
  startLonLat: undefined | LonLat,
  onReaction: (coords: LonLat) => any,
) => void;

const schemas = new Ajv();

class FormConfigEditorState {
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

interface Operations {
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
        <ButtonGroup variant="contained">
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
        </ButtonGroup>
      </Grid>
    </Grid>
  );
});

export const FormField = observer<{
  field: FieldKinds | RootFieldKinds;
  state: FormConfigEditorState;
  parent?: JsonPointer;
  operations?: Operations;
}>(({ field, state, parent = new JsonPointer([]), operations }) => {
  const theme = useTheme();

  switch (field.kind) {
    case 'field': {
      const pointer = parent.concat(field.pointer);
      const { errors, isValid = true } =
        state.fieldValidation.get(pointer.pointer) ?? {};

      const value = pointer.get(state.data);

      const fieldType = (() => {
        if (field.variant) return field.variant;

        if ('enum' in field.schema) return 'enum' as const;
        if (field.schema.type === 'boolean') return 'boolean' as const;
        if (field.schema.type === 'number') return 'number' as const;

        return 'text' as const;
      })();

      switch (fieldType) {
        case 'enum': {
          const selectId = `${pointer.pointer}`;

          return (
            <Grid item>
              <FormControl
                size="small"
                variant="outlined"
                css={css`
                  && {
                    margin: 0.5em 0;
                    width: 100%;

                    min-width: 100px;
                    max-width: 225px;
                  }
                `}
              >
                <InputLabel shrink id={selectId}>
                  {field.name}
                </InputLabel>
                <Select
                  error={!isValid}
                  labelId={selectId}
                  value={value ?? ''}
                  input={<OutlinedInput notched label={field.name} />}
                  autoWidth
                  fullWidth
                  onChange={(e) => {
                    state.setField({ pointer, field, value: e.target.value });
                  }}
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  {(field.schema as any).enum.map((v: string) => (
                    <MenuItem key={v} value={v}>
                      {pascalCase(v.toString())}
                    </MenuItem>
                  ))}
                </Select>
                {!isValid && (
                  <FormHelperText
                    css={css`
                      color: red;
                    `}
                  >
                    <small> {errors?.[0]?.message}</small>
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
          );
        }

        case 'boolean': {
          console.log({
            pointer,
            field,
            value,
          });

          return (
            <Grid item>
              <FormControlLabel
                css={css`
                  margin: 0.5em 0.25em;
                `}
                checked={value as any}
                onChange={(e, isChecked) =>
                  state.setField({
                    pointer,
                    field,
                    value: isChecked,
                  })
                }
                control={<Switch />}
                label={field.name}
              />
            </Grid>
          );
        }

        default: {
          return (
            <Grid item flexGrow={1}>
              <$TextField
                variant="outlined"
                size="small"
                label={<>{field.name}</>}
                type={fieldType}
                multiline={fieldType === 'textarea'}
                value={value ?? ''}
                error={!isValid}
                helperText={errors?.[0]?.message}
                css={css`
                  ${fieldType === 'number'
                    ? css`
                        min-width: 150px;
                        max-width: 250px;
                      `
                    : ''}
                `}
                InputLabelProps={{
                  shrink: true,
                }}
                InputProps={{
                  ...(field.unit
                    ? {
                        endAdornment: (
                          <InputAdornment position="end">
                            {field.unit}
                          </InputAdornment>
                        ),
                      }
                    : {}),
                }}
                onChange={(e) =>
                  state.setField({
                    pointer,
                    field,
                    value:
                      fieldType === 'number'
                        ? Number(e.target.value)
                        : e.target.value,
                  })
                }
              />
            </Grid>
          );
        }
      }
    }

    case 'stepper': {
      const stepperId = field.id;
      const step = state.stepperGroups.get(stepperId) ?? 0;

      return (
        <StepperForm
          css={css`
            flex-grow: 1;
          `}
          activeStepIndex={step}
          steps={Object.fromEntries(
            field.steps.map((s, i) => [
              i,
              {
                head: <>{s.name}</>,
                body() {
                  return s.fields.map((f, i) => (
                    <FormField
                      key={i}
                      field={f}
                      state={state}
                      operations={operations}
                      parent={parent}
                    />
                  ));
                },
              },
            ]),
          )}
          onStep={(nextStep) => state.setStepper(stepperId, nextStep)}
          stepper={{
            nonLinear: true,
          }}
        />
      );
    }

    case 'group': {
      const isCollapseDisabled =
        !field.collapsing || field.collapsing === 'disabled';
      const isCollapsed = useMemo(
        () =>
          new BooleanModel(
            field.collapsing === 'initiallyOpen'
              ? false
              : field.collapsing === 'initiallyClosed',
          ),
        [],
      );

      console.log(
        field.name,
        { isCollapsed, isCollapseDisabled },
        !!isCollapsed,
      );

      return (
        <$GroupRow>
          <Grid container flexGrow={1}>
            {!!field.name && (
              <GroupHeading
                collapsing={isCollapseDisabled ? undefined : isCollapsed}
              >
                {field.name}
              </GroupHeading>
            )}
            <$Collapse in={!isCollapsed.value} mountOnEnter>
              {field.fields.map((f, i) => (
                <FormField
                  key={i}
                  field={f}
                  state={state}
                  operations={operations}
                  parent={parent}
                />
              ))}
            </$Collapse>
          </Grid>
        </$GroupRow>
      );
    }

    case 'set': {
      const pointer = parent.concat(field.pointer);
      const rows = (pointer.get(state.data) ?? []) as any[];
      const isCollapseDisabled =
        !field.collapsing || field.collapsing === 'disabled';
      const isCollapsed = useMemo(
        () =>
          new BooleanModel(
            field.collapsing === 'initiallyClosed'
              ? false
              : field.collapsing === 'initiallyOpen',
          ),
        [],
      );

      if (!isArray(rows))
        return <>Expected list `set` value at: {pointer.path}</>;

      function removeRowFromSet(rowIndex: number) {
        state.setInData(() => {
          rows.splice(rowIndex, 1);
          state.validateEntireForm();
        });
      }

      function addNewRowToSet(fields: FieldKinds[]) {
        state.setInData(() => {
          const emptyRow = extractScaffoldFromFields(fields);

          rows.unshift(emptyRow);
          state.validateEntireForm();
        });
      }

      return (
        <>
          {!!field.name && (
            <GroupHeading
              collapsing={isCollapseDisabled ? undefined : isCollapsed}
            >
              {pluralize(field.name)}
            </GroupHeading>
          )}
          <$Collapse in={!isCollapsed.value} mountOnEnter>
            {rows.map((row, rowIndex) => {
              const rowPointer = pointer.concat(`/${rowIndex.toString()}`);

              return (
                <Grid
                  container
                  key={rowIndex}
                  css={css`
                    margin-bottom: 10px;
                    border: 2px solid ${theme.palette?.grey?.[300]};
                    padding: 1em;
                    padding-bottom: 3em;
                    margin: 1em 0;
                    position: relative;
                    width: 100%;
                  `}
                >
                  <Grid item flexGrow={1}>
                    {field.fields.map((f, i) => (
                      <FormField
                        key={i}
                        field={f}
                        state={state}
                        operations={operations}
                        parent={rowPointer}
                      />
                    ))}
                    <ConfirmDropdown
                      css={css`
                        position: absolute;
                        bottom: -2px;
                        right: -2px;
                      `}
                      trigger={{
                        icon: <DiscardIcon fontSize="small" />,
                        label: (
                          <>
                            <small>Remove</small>
                          </>
                        ),
                      }}
                      confirm={{
                        icon: <DiscardIcon />,
                        label: (
                          <>
                            <small>Remove</small>
                          </>
                        ),
                        onClick() {
                          removeRowFromSet(rowIndex);
                        },
                      }}
                    />
                  </Grid>
                </Grid>
              );
            })}
            <Grid container>
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => {
                  addNewRowToSet(field.fields);
                }}
                startIcon={<AddBoxIcon />}
              >
                Add {!!field.name && pluralize(field.name, 1)}
              </Button>
            </Grid>
          </$Collapse>
        </>
      );
    }

    case 'location': {
      const { x: xField, y: yField } = field.location;
      const xPointer = parent.concat(xField.pointer);
      const yPointer = parent.concat(yField.pointer);
      const xValue = xPointer.get(state.data) as number;
      const yValue = yPointer.get(state.data) as number;

      return (
        <$GroupRow>
          <Grid item>
            <ButtonGroup
              variant="outlined"
              color="primary"
              css={css`
                margin-top: 0.5em;
                margin-bottom: 0.6em;
              `}
            >
              <Tooltip title="Click to pick a location on the map" arrow>
                <Button
                  variant="outlined"
                  startIcon={<RoomIcon />}
                  onClick={() => {
                    const hasLonLat = !!xValue && !!yValue;

                    operations?.onPickingLocation?.(
                      hasLonLat ? [xValue, yValue] : undefined,
                      ([longitude, latitude]) => {
                        state.setField({
                          pointer: xPointer,
                          field: xField,
                          value: Number(longitude.toFixed(8)),
                        });

                        state.setField({
                          pointer: yPointer,
                          field: yField,
                          value: Number(latitude.toFixed(8)),
                        });
                      },
                    );
                  }}
                >
                  Pick
                </Button>
              </Tooltip>
              <Tooltip title="View location on map" arrow>
                <Button
                  startIcon={<LocationSearchingIcon />}
                  onClick={() => {
                    operations?.onGotoLocation?.([xValue, yValue]);
                  }}
                >
                  Goto
                </Button>
              </Tooltip>
            </ButtonGroup>
            <br />
            <Grid container>
              <FormField
                field={yField}
                state={state}
                operations={operations}
                parent={parent}
              />
              <FormField
                field={xField}
                state={state}
                operations={operations}
                parent={parent}
              />
            </Grid>
          </Grid>
        </$GroupRow>
      );
    }

    case 'action': {
      console.log('action', field);

      return (
        <Grid item>
          <Button
            // startIcon={<LocationSearchingIcon />}
            variant="text"
            onClick={() => {
              // TODO: add debug info if not existing
              operations?.onAction?.(field, { parent });
            }}
          >
            {field.label ?? field.id}
          </Button>
        </Grid>
      );
    }

    default:
      return <></>;
  }
});

function validateSchema(schema: Schema, value: any) {
  const validate = schemas.compile(schema);
  const isValid = validate(value);

  return { isValid, errors: validate.errors };
}

const GridRow = (p: PropsOf<typeof Grid>) => <Grid container {...p} />;
const $GroupRow = styled(GridRow)`
  border-left: 2px solid
    ${(x: any) =>
      x.theme?.palette?.mode === 'dark'
        ? 'rgba(255, 255, 255, 0.08)'
        : 'rgba(0, 0, 0, 0.07)'};
  padding-left: 1em;
  margin: 0.5em 0;
`;

const $TextField = styled(TextField)`
  && {
    margin: 0.45em 0;
    min-width: 100px;
    width: 100%;
  }
`;
const $SmallTextField = styled($TextField)`
  max-width: 160px;
`;

function walkFormData({
  onField,
  form,
  data,
}: {
  data: {};
  form: FormConfig;
  onField(pointer: JsonPointer, field: Field): void;
}) {
  function walk(field: RootFieldKinds, parent: JsonPointer) {
    switch (field.kind) {
      case 'group': {
        field.fields.forEach((f) => walk(f, parent));

        return;
      }

      case 'set': {
        const pointer = parent.concat(field.pointer);
        const listData = (pointer.get(data) ?? []) as any[];

        listData.forEach((_, index) => {
          field.fields.forEach((f) => {
            walk(f, pointer.concat([index.toString()]));
          });
        });

        return;
      }

      case 'location': {
        walk(field.location.x, parent);
        walk(field.location.y, parent);

        return;
      }

      case 'stepper': {
        field.steps.forEach((s) => {
          s.fields.forEach((f) => walk(f, parent));
        });

        return;
      }

      case 'field': {
        const pointer = parent.concat(field.pointer);

        onField(pointer, field);
      }
    }
  }

  return form.fields.forEach((f) => walk(f, new JsonPointer([])));
}

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

const GroupHeading = observer<{
  collapsing?: BooleanModel;
  children: ReactNode;
}>(({ collapsing, children }) => {
  const theme = useTheme();

  return (
    <>
      <Button
        variant="text"
        endIcon={
          !!collapsing && (
            <ExpandMoreIcon
              fontSize="small"
              css={css`
                margin-left: 1em;
                margin-right: 0.5em;
                opacity: 0.75;
                transform: ${collapsing.isTrue
                  ? 'rotate(-90deg)'
                  : 'rotate(0deg)'};
                transition: all 0.2s;
              `}
            />
          )
        }
        css={css`
          justify-content: space-between;
          align-items: center;
          flex-grow: 1;
          width: 100%;
          padding: 0.75em 1em 1.25em;
          margin: 0.25em 0 0.75em;

          &.Mui-disabled {
            color: inherit;
            opacity: 0.85;
          }
        `}
        color="inherit"
        disabled={!collapsing}
        disableRipple={!collapsing}
        disableElevation={!collapsing}
        disableTouchRipple={!collapsing}
        disableFocusRipple={!collapsing}
        onClick={collapsing?.toggle}
      >
        <span
          css={css`
            font-size: 1em;
            font-weight: 600;
            opacity: 0.75;
            display: flex;
            flex-grow: 1;
            text-align: left;
            align-items: center;
            width: 100%;
          `}
        >
          {children}
        </span>
      </Button>
    </>
  );
});

type StyledProps = {
  theme?: {
    palette?: {
      mode: 'light' | 'dark';
    };
  };
};

const $Collapse = styled(Collapse)`
  width: 100%;
`;
