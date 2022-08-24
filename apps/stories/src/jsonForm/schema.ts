import {
  FieldGroup,
  FormConfig,
  ofType,
  StepperGroup,
} from '@dhi/arsenal.jsonform';

const ofFieldGroup = ofType<FieldGroup>();
const ofStepperField = ofType<StepperGroup['steps'][number]>();
const ofFormConfig = ofType<FormConfig>();

export enum SchemaCustomComponents {
  selectedEvent = 'selectedEvent',
}

export const effluentConcentrationGroup = ofFieldGroup({
  kind: 'group',
  name: 'Effluent Concentration',
  fields: [
    {
      kind: 'field',
      name: 'Enterococci',
      pointer: '/effluentConcentration/enterococci',
      unit: 'per 100ml',
      schema: { type: 'number', minimum: 0, maximum: 1000000 },
    },
    {
      kind: 'field',
      name: 'Ammonia',
      pointer: '/effluentConcentration/ammonia',
      unit: 'mg/L',
      schema: { type: 'number', minimum: 0, maximum: 50 },
    },
    {
      kind: 'field',
      name: 'Nitrates',
      pointer: '/effluentConcentration/nitrates',
      unit: 'mg/L',
      schema: { type: 'number', minimum: 0, maximum: 50 },
    },
    {
      kind: 'field',
      name: 'Phosphate',
      pointer: '/effluentConcentration/phosphate',
      unit: 'mg/L',
      schema: { type: 'number', minimum: 0, maximum: 50 },
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
      schema: { type: 'number', minimum: 0, maximum: 50 },
    },
    {
      kind: 'field',
      name: 'Total Suspended Solids',
      pointer: '/effluentConcentration/totalSuspendedSolids',
      unit: 'mg/L',
      schema: { type: 'number', minimum: 0, maximum: 1000 },
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
              kind: 'component',
              component: SchemaCustomComponents.selectedEvent,
            },
            {
              kind: 'field',
              name: 'Event Type',
              pointer: '/selectedEvent/eventName',
              schema: {
                type: 'string',
                oneOf: [
                  { const: 'Event 1', description: '(1) March 2017' },
                  { const: 'Event 2', description: '(2) January 2017' },
                ],
              },
            },
          ],
        },
      ],
    },
  ],
});

export const reditScenarioSchema = () => reditScenarioForm;

// export const reditScenarioFormJson = JSON.stringify(reditScenarioForm, null, 2);
interface StatisticsMetricScale {
  value: ScenarioStatisticValueKinds;
  label: string;
}

export const statisticScales: StatisticsMetricScale[] = [
  { value: 'max', label: 'Maximum' },
  { value: 'average', label: 'Average' },
  { value: '95', label: '95th Percentile' },
  { value: '98', label: '98th Percentile' },
  { value: '50', label: '50th Percentile' },
];

export enum EffluentChoices {
  enterococci = 'enterococci',
  ammonia = 'ammonia',
  nitrates = 'nitrates',
  phosphate = 'phosphate',
  totalKjeldahlNitrogen = 'totalKjeldahlNitrogen',
  nitrogen = 'nitrogen',
  phosphorus = 'phosphorus',
  totalSuspendedSolids = 'totalSuspendedSolids',
}
export type ScenarioStatisticPercentiles = '95' | '98' | '50';
export type ScenarioStatisticValueKinds =
  | 'max'
  | 'average'
  | ScenarioStatisticPercentiles;
