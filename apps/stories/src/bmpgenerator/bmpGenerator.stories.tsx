import { styled } from '@dhi/arsenal.ui';
import * as React from 'react';
import { SERVICE_URL } from '../__dev/constants';
import { BmpGenerator } from '@dhi/arsenal.bmpgenerator';
import { vesselcheckTemplateVariables } from './vesselcheckVariables';

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
