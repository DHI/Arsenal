import { styled } from '@dhi/arsenal.ui';
import * as React from 'react';
import { BmpGenerator } from '@dhi/arsenal.bmpgenerator';
import { vesselcheckTemplateVariables } from './vesselcheckVariables';

/** Make sure this has a trailing slash or else it wont work right */
const SERVICE_URL = window.REACT_ENV.REACT__BMP_SERVICE_URL ?? '';

console.table({ SERVICE_URL });

export default {
  title: 'BmpGenerator',
  useIframe: true,
};

export const main = () => {
  return (
    <$Container>
      <BmpGenerator
        serviceUrl={SERVICE_URL}
        variables={vesselcheckTemplateVariables}
      />
    </$Container>
  );
};

const $Container = styled.div`
  width: 100%;
  height: 100%;
  background: #fff;
`;
