export const mailMergeVariables = [
  { id: 'BMPDate', kind: 'text', value: '' },
  { id: 'VesselName', kind: 'text', value: '' },
  { id: 'IMONumber', kind: 'text', value: '' },
  {
    id: 'VesselImage',
    kind: 'image',
    value: {
      src: '',
      height: 0,
      width: 0,
    },
  },
  { id: 'UserName', kind: 'text', value: '' },
  { id: 'VesselFlag', kind: 'text', value: '' },
  { id: 'VesselTonnage', kind: 'text', value: '' },
  { id: 'VesselLength', kind: 'text', value: '' },
  { id: 'VesselBeam', kind: 'text', value: '' },
  { id: 'VesselType', kind: 'text', value: '' },
  { id: 'VesselCallSign', kind: 'text', value: '' },
  { id: 'VesselMMSINumber', kind: 'text', value: '' },
  { id: 'VesselOpsStartDate', kind: 'text', value: '' },
  { id: 'VesselOpEndDate', kind: 'text', value: '' },
  { id: 'VesselAvgSpeed', kind: 'text', value: '' },
  { id: 'PeriodUnderway', kind: 'text', value: '' },
  { id: 'PeriodBirthed', kind: 'text', value: '' },
  {
    id: 'VesselNicheAreasTable',
    kind: 'table',
    value: { header: ['Nr', 'Main Area', 'Sub Area', 'Position'], rows: [] },
  },
  {
    id: 'VesselManagementActionTable',
    kind: 'table',
    value: {
      header: [
        'Nr',
        'Management Action',
        'Description',
        'Interval (Months)',
        'Niche Area',
        'Sub-Area',
      ],
      rows: [],
    },
  },
  {
    id: 'VesselOpsTable',
    kind: 'table',
    value: {
      header: ['From Date', 'To Date', 'Operational Profile'],
      rows: [],
    },
  },
  {
    id: 'VesselAFCDataTable',
    kind: 'table',
    value: {
      header: ['Nr', 'Paint', 'Date Applied', 'Main Area', 'Sub Area'],
      rows: [],
    },
  },
  {
    id: 'VesselRecordBookTable',
    kind: 'table',
    value: {
      header: [
        'Date',
        'Management Action',
        'Description',
        'Report Reference',
        'Niche Areas',
        'Responsible Person',
        'Signature',
      ],
      rows: [],
    },
  },
  {
    id: 'VesselRiskTable',
    kind: 'table',
    value: {
      headerPosition: 'left',
      header: [
        'Risk Metric',
        'Hull Husbandry',
        'Niche Management',
        'Antifouling Coating',
        'Layup Period',
        'External Niche Management',
        'Internal Niche Management',
      ],
      rows: [],
    },
  },
];

export const openTag = '{{';
export const closeTag = '}}';

export const exampleMailMergeBody = {
  /** SFDT format object */
  document: {
    /* {"sections":[{"sectionFormat":{"pageWidth": */
  },
  /** Tag list to interpolate */
  tags: [
    {
      tag: '{{SomeField}}',
      type: 'text',
      value: '1234',
    },
    {
      tag: '{{SomeTable}}',
      type: 'table',
      value: {
        header: ['Col1', 'Col2', 'Col3'],
        rows: [
          ['1', '2', '3'],
          ['4', '5', '6'],
        ],
      },
    },
  ],
};

export const vesselcheckTemplateVariables = {
  VesselName: '::VesselName::',
  IMONumber: '::IMONumber::',
  BMPDate: '::BMPDate::',
  UserName: '::UserName::',
  VesselFlag: '::VesselFlag::',
  VesselTonnage: '::VesselTonnage::',
  VesselLenght: '::VesselLenght::',
  VesselBeam: '::VesselBeam::',
  VesselType: '::VesselType::',
  VesselCallSign: '::VesselCallSign::',
  VesselMMSINumber: '::VesselMMSINumber::',
  VesselOpsTable: '::VesselOpsTable::',
};
