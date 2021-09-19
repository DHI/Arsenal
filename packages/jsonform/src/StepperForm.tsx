import * as React from 'react';
import { observer } from 'mobx-react-lite';
import { css, styled } from '../../ui/src/css';
import * as ui from '@dhi/arsenal.ui';

export const StepperForm = observer<{
  activeStepIndex: number;
  onStep?(stepIndex: number): void;
  steps: {
    [stepIndex: string]: {
      head: React.ReactNode;
      body(): React.ReactNode;
    };
  };
  nextPrevButtons?: boolean;
  stepper?: Partial<PropsOf<typeof ui.Stepper>>;

  className?: string;
}>(
  ({
    activeStepIndex,
    onStep,
    steps,
    stepper,
    nextPrevButtons = true,
    ...p
  }) => (
    <ui.Stepper
      orientation="vertical"
      activeStep={activeStepIndex}
      {...p}
      {...stepper}
    >
      {Object.entries(steps).map(([stepId, { head, body }], i, all) => (
        <ui.Step key={stepId}>
          <ui.StepButton onClick={() => onStep?.(Number(stepId))}>
            {head}
          </ui.StepButton>
          <$StepContent>
            {body()}
            {nextPrevButtons && (
              <ui.$Row
                css={css`
                  margin-top: 1em;
                  margin-bottom: -1em;
                `}
              >
                <ui.ButtonGroup>
                  <ui.Button
                    startIcon={<ui.LeftIcon />}
                    disabled={i === 0}
                    onClick={() => onStep?.(i - 1)}
                  >
                    Back
                  </ui.Button>
                  <ui.Button
                    endIcon={<ui.RightIcon />}
                    disabled={i === all.length - 1}
                    onClick={() => onStep?.(i + 1)}
                  >
                    Next
                  </ui.Button>
                </ui.ButtonGroup>
              </ui.$Row>
            )}
          </$StepContent>
        </ui.Step>
      ))}
    </ui.Stepper>
  ),
);

const $StepContent = styled(ui.StepContent)`
  padding-top: 1em;
  padding-bottom: 1em;
`;
