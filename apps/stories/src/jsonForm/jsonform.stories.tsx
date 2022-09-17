import { css, observer } from '@dhi/arsenal.ui';
import * as React from 'react';
import { FormConfigEditor } from '@dhi/arsenal.jsonform';
import { reditScenarioForm } from './schema';
import { $Row, $Col } from '@dhi/arsenal.ui/src/components';
import { PropsOf } from '@emotion/react';

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
    <$Row
      css={css`
        overflow: auto;
        height: 100%;
        && {
          align-items: stretch;
        }
      `}
    >
      <Box
        title="Form"
        grow
        css={css`
          width: 500px;
        `}
      >
        <FormConfigEditor
          form={reditScenarioForm}
          data={data}
          onData={setData}
        />
      </Box>
      <$Col
        css={css`
          align-items: stretch;
        `}
      >
        <Box
          title="Form Configuration"
          css={css`
            max-height: 50%;
          `}
        >
          <pre
            css={css`
              font-size: 90%;
            `}
          >
            {JSON.stringify(reditScenarioForm, null, 2)}
          </pre>
        </Box>
        <Box title="Output JSON">
          <pre
            css={css`
              font-size: 90%;
            `}
          >
            {JSON.stringify(data, null, 2)}
          </pre>
        </Box>
      </$Col>
    </$Row>
  );
});

const Box = (p: PropsOf<typeof $Row> & { title: string }) => {
  return (
    <$Row
      css={css`
        && {
          margin: 0.5em;
          border: 2px solid #0003;
          border-radius: 6px;
          align-items: stretch;
          position: relative;
        }
      `}
      {...p}
    >
      <div
        css={css`
          height: 100%;
          width: 100%;
          padding: 1em;
          overflow: auto;
        `}
      >
        {p.children}
      </div>
      <div
        css={css`
          position: absolute;
          top: -0.6em;
          left: 0.5em;
          background: #fff;
          padding: 0 0.5em;
          font-weight: 600; ;
        `}
      >
        {p.title}
      </div>
    </$Row>
  );
};
