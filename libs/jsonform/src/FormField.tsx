import { BooleanModel } from '@dhi/arsenal.models';
import { css, PropsOf } from '@emotion/react';
import styled from '@emotion/styled';
import {
  Button,
  Checkbox,
  Collapse,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  InputAdornment,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  TextField,
  Tooltip,
  useTheme,
} from '@mui/material';
import { Schema } from 'ajv';
import { pascalCase } from 'change-case';
import { JsonPointer } from 'json-ptr';
import isArray from 'lodash-es/isArray';
import { observer } from 'mobx-react-lite';
import pluralize from 'pluralize';
import * as React from 'react';
import { ReactNode, useMemo } from 'react';
import { ConfirmDropdown } from './components/dropdowns';
import {
  AddBoxIcon,
  DiscardIcon,
  ExpandMoreIcon,
  LocationSearchingIcon,
  RoomIcon,
} from './components/icons';
import { $Row } from './components/layout';
import { StepperForm } from './components/StepperForm';
import { extractScaffoldFromFields } from './extractScaffoldFromFields';
import { FormConfigEditorState, Operations, schemas } from './FormConfigEditor';
import { Field, FieldKinds, FormConfig, RootFieldKinds } from './types';

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
        if (field.schema.type === 'boolean') return 'checkbox' as const;
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

        case 'primaryCheckbox':
        case 'unlabeledCheckbox':
          return (
            <Grid item>
              <Checkbox
                checked={value as any}
                onChange={(e, isChecked) =>
                  state.setField({
                    pointer,
                    field,
                    value: isChecked,
                  })
                }
              />
            </Grid>
          );

        case 'checkbox':
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
                control={<Checkbox />}
                label={field.name}
              />
            </Grid>
          );

        default:
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

      const primaryCheckboxField = field.fields.find(
        (f) => f.kind === 'field' && f.variant === 'primaryCheckbox',
      ) as undefined | Field;

      const filteredFields = field.fields.filter(
        (v) => v !== primaryCheckboxField,
      );

      return (
        <$GroupRow>
          <Grid container flexGrow={1}>
            {!!field.name && (
              <GroupHeading
                collapsing={isCollapseDisabled ? undefined : isCollapsed}
                primaryBoolean={
                  primaryCheckboxField ? (
                    <FormField
                      field={primaryCheckboxField}
                      {...{ state, operations, parent }}
                    />
                  ) : undefined
                }
              >
                {field.name}
              </GroupHeading>
            )}
            <$Collapse in={!isCollapsed.value} mountOnEnter>
              {filteredFields.map((f, i) => (
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
          <$GroupRow>
            {!!field.name && (
              <GroupHeading
                collapsing={isCollapseDisabled ? undefined : isCollapsed}
              >
                {pluralize(field.name)}
                {` (${rows.length})`}
              </GroupHeading>
            )}
            <Grid container>
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => {
                  addNewRowToSet(field.fields);
                  isCollapsed.setFalse();
                }}
                startIcon={<AddBoxIcon />}
              >
                Add {!!field.name && pluralize(field.name, 1)}
              </Button>
            </Grid>
            <$Collapse in={!isCollapsed.value} mountOnEnter>
              {rows.map((row, rowIndex) => {
                const rowPointer = pointer.concat(`/${rowIndex.toString()}`);

                return (
                  <$GroupRow
                    container
                    key={rowIndex}
                    css={css`
                      margin-bottom: 14px;
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
                  </$GroupRow>
                );
              })}
            </$Collapse>
          </$GroupRow>
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
            <div
              css={css`
                margin-top: 0.5em;
                margin-bottom: 0.6em;
              `}
            >
              <Tooltip title="Click to pick a location on the map" arrow>
                <Button
                  variant="outlined"
                  color="primary"
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
                  variant="outlined"
                  color="primary"
                  startIcon={<LocationSearchingIcon />}
                  onClick={() => {
                    operations?.onGotoLocation?.([xValue, yValue]);
                  }}
                >
                  Goto
                </Button>
              </Tooltip>
            </div>
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

export function validateSchema(schema: Schema, value: any) {
  const validate = schemas.compile(schema);
  const isValid = validate(value);

  return { isValid, errors: validate.errors };
}

const GridRow = (p: PropsOf<typeof Grid>) => <Grid container {...p} />;
const $GroupRow = styled(GridRow)`
  border: 2px solid
    ${(x: any) =>
      x.theme?.palette?.mode === 'dark'
        ? 'rgba(255, 255, 255, 0.08)'
        : 'rgba(0, 0, 0, 0.07)'};
  padding: 0.5em;
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

export function walkFormData({
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

const GroupHeading = observer<{
  collapsing?: BooleanModel;
  primaryBoolean?: ReactNode;
  children: ReactNode;
}>(({ collapsing, primaryBoolean, children }) => {
  const theme = useTheme();

  return (
    <>
      <$Row>
        {primaryBoolean}
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
            padding: 0.75em 1em 0.75em;

            & + div {
              margin-top: 1em;
            }

            &.Mui-disabled {
              color: inherit;
              opacity: 0.85;
            }
          `}
          color="inherit"
          disabled={!collapsing}
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
      </$Row>
    </>
  );
});

const $Collapse = styled(Collapse)`
  width: 100%;
`;
