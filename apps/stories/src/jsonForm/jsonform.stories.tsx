import { css, observer, styled } from '@dhi/arsenal.ui';
import { Grid, Paper } from '@material-ui/core';
import * as React from 'react';
import {
  extractScaffoldFromFields,
  FormConfigEditor,
} from '@dhi/arsenal.jsonform';
import { WithDarkTheme } from '../__dev/themes';
import { reditScenarioForm, outfallParameterFields } from './schema';

export default {
  title: 'JsonForm',
};

export const Main = observer(() => {
  const [data, setData] = React.useState({
    name: 'foo',
    outflowLocations: [],
    selectedEvent: {},
  });

  return (
    <WithDarkTheme>
      <Grid
        container
        css={css`
          overflow: auto;
          height: 100vh;
        `}
      >
        <Grid item>
          <$Container>
            <FormConfigEditor
              form={reditScenarioForm}
              data={data}
              onData={setData}
            />
          </$Container>
        </Grid>
        <Grid item>
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
        </Grid>

        <Grid item>
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
      </Grid>
    </WithDarkTheme>
  );
});

export function Fn_extractScaffoldFromFields() {
  return (
    <$Container>
      <pre>
        {JSON.stringify(
          extractScaffoldFromFields(outfallParameterFields.fields),
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
