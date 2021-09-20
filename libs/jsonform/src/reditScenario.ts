import { FieldGroup, FormConfig, ofType, StepperGroup } from './formConfig';

const ofFieldGroup = ofType<FieldGroup>();
const ofStepperField = ofType<StepperGroup['steps'][number]>();
const ofFormConfig = ofType<FormConfig>();

export const effluentConcentrationGroup = ofFieldGroup({
  kind: 'group',
  name: 'Effluent Concentration',
  fields: [
    {
      kind: 'field',
      name: 'Enterococci',
      pointer: '/effluentConcentration/enterococci',
      unit: 'per 100ml',
      schema: { type: 'number', minimum: 0, maximum: 900000 },
    },
    {
      kind: 'field',
      name: 'Ammonia',
      pointer: '/effluentConcentration/ammonia',
      unit: 'mg/L',
      schema: { type: 'number', minimum: 0, maximum: 30 },
    },
    {
      kind: 'field',
      name: 'Nitrates',
      pointer: '/effluentConcentration/nitrates',
      unit: 'mg/L',
      schema: { type: 'number', minimum: 0, maximum: 45 },
    },
    {
      kind: 'field',
      name: 'Total Kjeldahl Nitrogen',
      pointer: '/effluentConcentration/totalKjeldahlNitrogen',
      unit: 'mg/L',
      schema: { type: 'number', minimum: 0, maximum: 50 },
    },
    {
      kind: 'field',
      name: 'Total Nitrogen',
      pointer: '/effluentConcentration/nitrogen',
      unit: 'mg/L',
      schema: { type: 'number', minimum: 0, maximum: 50 },
    },
    {
      kind: 'field',
      name: 'Total Phosphorus',
      pointer: '/effluentConcentration/phosphorus',
      unit: 'mg/L',
      schema: { type: 'number', minimum: 0, maximum: 30 },
    },
    {
      kind: 'field',
      name: 'Total Suspended Solids',
      pointer: '/effluentConcentration/totalSuspendedSolids',
      unit: 'mg/L',
      schema: { type: 'number', minimum: 0, maximum: 550 },
    },
  ],
});

export const outfallParameterFields = ofStepperField({
  name: 'Outfall Parameters',
  fields: [
    {
      kind: 'set',
      id: 'outfallparams',
      name: 'Outfall parameters',
      pointer: '/outflowLocations',
      canCreate: true,
      canDelete: true,
      fields: [
        {
          kind: 'field',
          pointer: '/name',
          name: 'Name',
          schema: { type: 'string', minLength: 1, maxLength: 60 },
        },
        {
          kind: 'location',
          location: {
            x: {
              kind: 'field',
              name: 'Longitude',
              pointer: '/longitude',
              schema: { type: 'number' },
            },
            y: {
              kind: 'field',
              name: 'Latitude',
              pointer: '/latitude',
              schema: { type: 'number' },
            },
          },
        },
        {
          kind: 'field',
          name: 'Discharge Rate',
          pointer: '/dischargeRate',
          unit: 'm3/s',
          schema: {
            type: 'number',
            minimum: 0.1,
            maximum: 22,
          },
        },
        effluentConcentrationGroup,
      ],
    },
  ],
});

export const reditScenarioForm = ofFormConfig({
  fields: [
    {
      kind: 'stepper',
      id: 'main',
      steps: [
        {
          name: 'Primary Information',
          fields: [
            {
              kind: 'field',
              pointer: '/name',
              name: 'Name',
              schema: { type: 'string', minLength: 3, maxLength: 32 },
            },
            {
              kind: 'field',
              pointer: '/description',
              name: 'Description',
              variant: 'textarea',
              schema: { type: 'string' },
            },
          ],
        },
        outfallParameterFields,
        {
          name: 'Event Selection',
          fields: [
            {
              kind: 'field',
              name: 'Model Name',
              pointer: '/modelName',
              schema: {
                type: 'string',
                enum: ['Dummy_MVP', 'Sample_MVP'],
              },
            },
            {
              kind: 'field',
              name: 'Event Type',
              pointer: '/selectedEvent/eventName',
              schema: {
                type: 'string',
                enum: ['Event 1', 'Event 2', 'Event 3'],
              },
            },
          ],
        },
      ],
    },
  ],
});

// export const reditScenarioFormJson = JSON.stringify(reditScenarioForm, null, 2);
// console.log(reditScenarioFormJson);
