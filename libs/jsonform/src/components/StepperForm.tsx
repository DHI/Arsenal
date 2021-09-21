import * as React from 'react';
import { observer } from 'mobx-react-lite';
import { css, PropsOf, styled } from '@dhi/arsenal.ui';
import {
  Button,
  ButtonGroup,
  Grid,
  Step,
  StepButton,
  StepContent,
  Stepper,
} from '@material-ui/core';
import { ArrowLeft, ArrowRight } from '@material-ui/icons';

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
  stepper?: Partial<PropsOf<typeof Stepper>>;

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
    <Stepper
      orientation="vertical"
      activeStep={activeStepIndex}
      {...p}
      {...stepper}
    >
      {Object.entries(steps).map(([stepId, { head, body }], i, all) => (
        <Step key={stepId}>
          <StepButton onClick={() => onStep?.(Number(stepId))}>
            {head}
          </StepButton>
          <$StepContent>
            {body()}
            {nextPrevButtons && (
              <Grid
                css={css`
                  margin-top: 1em;
                  margin-bottom: -1em;
                `}
              >
                <ButtonGroup>
                  <Button
                    startIcon={<ArrowLeft />}
                    disabled={i === 0}
                    onClick={() => onStep?.(i - 1)}
                  >
                    Back
                  </Button>
                  <Button
                    endIcon={<ArrowRight />}
                    disabled={i === all.length - 1}
                    onClick={() => onStep?.(i + 1)}
                  >
                    Next
                  </Button>
                </ButtonGroup>
              </Grid>
            )}
          </$StepContent>
        </Step>
      ))}
    </Stepper>
  ),
);

const $StepContent = styled(StepContent)`
  padding-top: 1em;
  padding-bottom: 1em;
`;
