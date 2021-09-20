import { css, styled } from '@dhi/arsenal.ui';
import * as React from 'react';
import {} from '@material-ui/core';
import {
  FormConfigEditor,
} from '@dhi/arsenal.jsonform';
import { reditScenarioForm } from './reditScenario';

export default {
  title: 'Scenario Schema',
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

  return (
    <ui.WithDarkTheme>
      <Component />
    </ui.WithDarkTheme>
  );
}

const $Container = styled(ui.Paper)`
  min-width: 400px;
  display: flex;
`;
