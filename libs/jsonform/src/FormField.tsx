import { BooleanModel } from '@dhi/arsenal.models';
import { css, PropsOf, styled } from '@dhi/arsenal.ui';
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
} from '@mui/material';
import { Schema } from 'ajv';
import { JsonPointer } from 'json-ptr';
import isArray from 'lodash-es/isArray';
import { observer } from 'mobx-react-lite';
import pluralize from 'pluralize';
import * as React from 'react';
import { ReactNode, useMemo } from 'react';
import {
  ConfirmDropdown,
  $Col,
  $Row,
  StepperForm,
  AddBoxIcon,
  DiscardIcon,
  ExpandMoreIcon,
  LocationSearchingIcon,
  RoomIcon,
} from '@dhi/arsenal.ui/x/components';
import { extractScaffoldFromFields } from './extractScaffoldFromFields';
import { FormConfigEditorState, Operations, schemas } from './FormConfigEditor';
import {
  CollapseOptions,
  Field,
  FieldKinds,
  FormConfig,
  RootFieldKinds,
  SelectInputSchema,
} from './types';

export { JsonPointer };

export const FormField = observer<{
  field: FieldKinds | RootFieldKinds;
  state: FormConfigEditorState;
  parent?: JsonPointer;
  operations?: Operations;
}>(({ field, state, parent = new JsonPointer([]), operations }) => {
  switch (field.kind) {
    case 'field': {
      const pointer = parent.concat(field.pointer);

      const { errors, isValid = true } =
        state.fieldValidation.get(pointer.pointer) ?? {};
      const value = state.getState<string | undefined>(pointer);
      const isDisabled = field.layout?.disabled === true;

      const fieldType = (() => {
        if (field.layout?.hidden) return 'hidden';
        if (field.layout?.variant) return field.layout?.variant;

        if ('enum' in field.schema) return 'enum' as const;
        if (field.schema.type === 'boolean') return 'checkbox' as const;
        if (field.schema.type === 'number') return 'number' as const;

        return 'text' as const;
      })();

      switch (fieldType) {
        case 'hidden':
          return <></>;

        case 'enum': {
          const selectId = `${pointer.pointer}`;

          return (
            <Grid
              item
              css={css`
                flex-grow: 1;
              `}
            >
              <FormControl
                size="small"
                variant="outlined"
                disabled={isDisabled}
                css={css`
                  && {
                    margin: 0.5em 0;
                    width: 100%;
                    min-width: ${field.name.length + 1}ex;
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
                  autoWidth={false}
                  fullWidth
                  onChange={(e) => {
                    state.setField({ pointer, field, value: e.target.value });
                  }}
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  {(field.schema as SelectInputSchema).enum.map((v) => (
                    <MenuItem key={v} value={v}>
                      {v.toString()}
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
              <Tooltip title={`Toggles "${field.name}"`}>
                <Checkbox
                  disabled={isDisabled}
                  checked={value as any}
                  onChange={(e, isChecked) =>
                    state.setField({
                      pointer,
                      field,
                      value: isChecked,
                    })
                  }
                />
              </Tooltip>
            </Grid>
          );

        case 'checkbox':
          return (
            <Grid item>
              <FormControlLabel
                disabled={isDisabled}
                css={css``}
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
                disabled={isDisabled}
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
                  ...(field.layout?.unit
                    ? {
                        endAdornment: (
                          <InputAdornment position="end">
                            {field.layout?.unit}
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
            margin-bottom: 1em;
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
      /** When a primary checkbox is found, use it in the heading and remove it from the list. */
      const primaryCheckboxField = field.fields.find(
        (f) => f.kind === 'field' && f.layout?.variant === 'primaryCheckbox',
      ) as undefined | Field;

      const filteredFields = field.fields.filter(
        (v) => v !== primaryCheckboxField,
      );

      const body = (() => {
        const elements = filteredFields.map((f, i) => (
          <FormField
            key={i}
            field={f}
            state={state}
            operations={operations}
            parent={parent}
          />
        ));

        return field.layout?.direction === 'row' ? (
          <$Row
            css={css`
              > * + * {
                margin-left: 1ex;
              }
            `}
          >
            {elements}
          </$Row>
        ) : (
          <$Col grow>{elements}</$Col>
        );
      })();

      if (field.layout?.indentation === false) return body;

      return (
        <CollapsableGrouping
          collapsing={field.layout?.collapsing}
          heading={{
            before: primaryCheckboxField ? (
              <FormField
                field={primaryCheckboxField}
                {...{ state, operations, parent }}
              />
            ) : undefined,
            title: field.name,
          }}
        >
          {body}
        </CollapsableGrouping>
      );
    }

    case 'component': {
      if (!operations?.RenderComponentField)
        return <>RenderComponentField must be defined for {field.component}</>;

      return (
        <operations.RenderComponentField
          pointer={parent}
          state={state}
          field={field}
        />
      );
    }

    case 'set': {
      const pointer = parent.concat(field.pointer);
      const rows = state.getState<any[]>(pointer);

      if (!isArray(rows))
        return <>Expected `set` value to be a list, at: {pointer.path}</>;

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
        <CollapsableGrouping
          collapsing={field.layout?.collapsing}
          heading={{
            title: (
              <>
                {pluralize(field.name ?? '')}
                {` (${rows.length})`}
              </>
            ),
          }}
        >
          <Grid
            container
            css={css`
              padding: 1em 0.5em;
            `}
          >
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => {
                addNewRowToSet(field.fields);
              }}
              startIcon={<AddBoxIcon />}
            >
              New {!!field.name && pluralize(field.name, 1)}
            </Button>
          </Grid>
          {rows.map((row, rowIndex) => {
            const rowPointer = pointer.concat(`/${rowIndex.toString()}`);

            const primaryText = field.fields.find(
              (f) => f.kind === 'field' && f.layout?.variant === 'primaryText',
            ) as undefined | Field;

            const primaryTextValue: string | undefined = primaryText
              ? state.getState(rowPointer.concat(primaryText.pointer))
              : undefined;

            return (
              <CollapsableGrouping
                collapsing={field.layout?.rowCollapsing}
                key={rowIndex}
                heading={{
                  title: (
                    <$Row
                      css={css`
                        align-items: stretch;
                      `}
                    >
                      {primaryText ? (
                        <$Row
                          css={css`
                            margin-left: 1ex;
                          `}
                        >
                          {primaryTextValue || <>({rowIndex})</>}
                        </$Row>
                      ) : (
                        rowIndex
                      )}
                    </$Row>
                  ),
                }}
              >
                {field.fields.map((f, i) => (
                  <FormField
                    key={i}
                    field={f}
                    state={state}
                    operations={operations}
                    parent={rowPointer}
                  />
                ))}
                <$Row
                  css={css`
                    justify-content: flex-end;
                  `}
                >
                  <ConfirmDropdown
                    trigger={{
                      icon: <DiscardIcon fontSize="small" />,
                      label: <>Remove</>,
                    }}
                    confirm={{
                      icon: <DiscardIcon />,
                      label: <>Remove</>,
                      onClick: () => removeRowFromSet(rowIndex),
                    }}
                  />
                </$Row>
              </CollapsableGrouping>
            );
          })}
        </CollapsableGrouping>
      );
    }

    case 'location': {
      const { x: xField, y: yField } = field.location;
      const xPointer = parent.concat(xField.pointer);
      const yPointer = parent.concat(yField.pointer);
      const xValue = state.getState<number>(xPointer);
      const yValue = state.getState<number>(yPointer);

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
      return (
        <Grid item>
          <Button
            // startIcon={<LocationSearchingIcon />}
            variant="text"
            onClick={() => {
              if (!operations?.onAction) {
                console.warn(
                  `No onAction handler defined for action ${field.id}`,
                );

                return;
              }

              operations.onAction(field, { parent });
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
  position: relative;
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
  /** Inserted before the title element */
  before?: ReactNode;
  children: ReactNode;
  className?: string;
}>(({ collapsing, before, className, children }) => {
  return (
    <$Row {...{ className }}>
      {before}
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
  );
});

const CollapsableGrouping = observer<{
  collapsing?: CollapseOptions;
  heading?: {
    before?: ReactNode;
    after?: ReactNode;
    title?: ReactNode;
  };
  children: ReactNode | ((props: { isCollapsed: BooleanModel }) => ReactNode);
  className?: string;
}>(({ collapsing, heading, children, className }) => {
  const isCollapseDisabled = !collapsing || collapsing === 'disabled';

  const isCollapsed = useMemo(
    () =>
      new BooleanModel(
        collapsing === 'initiallyOpen'
          ? false
          : collapsing === 'initiallyClosed',
      ),
    [],
  );

  const hasTitle = !!heading?.title;

  return (
    <$GroupRow {...{ className }}>
      {hasTitle && (
        <GroupHeading
          collapsing={isCollapseDisabled ? undefined : isCollapsed}
          before={heading?.before}
          css={css`
            && {
              button span {
                font-weight: 900;
                ${isCollapsed.isTrue
                  ? css`
                      font-weight: 600;
                    `
                  : ''};
              }
            }
          `}
        >
          {heading?.title ?? ''}
        </GroupHeading>
      )}
      <$Collapse
        in={!isCollapsed.value}
        mountOnEnter
        css={css`
          padding-left: 0.75em;
        `}
      >
        <div
          css={css`
            padding-top: ${hasTitle ? '0.75em' : '0'};
          `}
        >
          {typeof children === 'function'
            ? children({ isCollapsed })
            : children}
        </div>
      </$Collapse>
    </$GroupRow>
  );
});

const $Collapse = styled(Collapse)`
  width: 100%;
`;
