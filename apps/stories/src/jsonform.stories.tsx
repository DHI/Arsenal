import { css, styled } from '@dhi/arsenal.ui';
import { Grid, Paper } from '@material-ui/core';
import * as React from 'react';
import {
  extractScaffoldFromFields,
  FormConfigEditor,
} from '@dhi/arsenal.jsonform';
import { outfallParameterFields, reditScenarioForm } from './reditScenario';

export default {
  title: 'JsonForm',
};

export function Main() {
  const Component = () => {
    const [data, setData] = React.useState({
      name: 'foo',
      outflowLocations: [],
      selectedEvent: {},
    });

    return (
      <Grid
        css={css`
          overflow: auto;
          height: 100vh;
        `}
      >
        <$Container>
          <FormConfigEditor
            form={reditScenarioForm}
            data={data}
            onData={setData}
          />
        </$Container>
        <$Container>
          <pre
            css={css`
              font-size: 90%;
              height: 100vh;
              overflow: auto;
            `}
          >
            {JSON.stringify(reditScenarioForm, null, 2)}
          </pre>
        </$Container>
        <$Container>
          <pre
            css={css`
              font-size: 90%;
              height: 100vh;
              overflow: auto;
            `}
          >
            {JSON.stringify(data, null, 2)}
          </pre>
        </$Container>
      </Grid>
    );
  };

  return <Component />;
}

export function Fn_extractScaffoldFromFields() {
  return (
    <$Container>
      <pre>
        {JSON.stringify(
          extractScaffoldFromFields(outfallParameterFields as any),
          null,
          2,
        )}
      </pre>
    </$Container>
  );
}

const $Container = styled(Paper)`
  min-width: 400px;
  display: flex;
`;
