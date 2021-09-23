import { styled } from '@dhi/arsenal.ui';
import * as React from 'react';
import { BmpGenerator, ReplacementProps } from '@dhi/arsenal.bmpgenerator';

/** Make sure this has a trailing slash or else it wont work right */
const SERVICE_URL = window.REACT_ENV.REACT__BMP_SERVICE_URL ?? '';

console.table({ SERVICE_URL });

export default {
  title: 'BmpGenerator',
  useIframe: true,
};

export const main = () => {
  const replacements: ReplacementProps = {
    textReplacements: [
      {
        tag: '{BMPDate}',
        value: '2021-09-23',
      },
      {
        tag: '{VesselName}',
        value: 'TEST VESSEL 1',
      },
      {
        tag: '{IMONumber}',
        value: '1261292',
      },
    ],
    tableReplacements: [
      {
        tag: '{VesselNicheAreasTable}',
        value: {
          header: ['Header1', 'Header2', 'Header3'],
          rows: [
            ['Row1Column1', 'Row1Column2', 'Row1Columm3'],
            ['Row2Column1', 'Row2Column2', 'Row2Columm3'],
          ],
        },
      },
    ],
    imageReplacements: [
      {
        tag: '{VesselImage}',
        value:
          'https://www.vessel-check.com/8cfb55c18900dba5afb4b38bcbe62fc2.png',
      },
    ],
  };

  return (
    <$Container>
      <BmpGenerator serviceUrl={SERVICE_URL} replacements={replacements} />
    </$Container>
  );
};

const $Container = styled.div`
  width: 100%;
  height: 100%;
  background: #fff;
`;
