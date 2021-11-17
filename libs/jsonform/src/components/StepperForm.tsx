import * as React from 'react';
import { observer } from 'mobx-react-lite';
import { css, PropsOf } from '@emotion/react';
import styled from '@emotion/styled';
import {
  Button,
  ButtonGroup,
  Grid,
  Step,
  StepButton,
  StepContent,
  Stepper,
  Tooltip,
} from '@mui/material';
import { ArrowLeft, ArrowRight } from '@mui/icons-material';

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
                  <Tooltip title="Previous step">
                    <div>
                      <Button
                        variant="outlined"
                        disabled={i === 0}
                        onClick={() => onStep?.(i - 1)}
                      >
                        <ArrowLeft />
                      </Button>
                    </div>
                  </Tooltip>
                  <Tooltip title="Next step">
                    <div>
                      <Button
                        variant="outlined"
                        disabled={i === all.length - 1}
                        onClick={() => onStep?.(i + 1)}
                      >
                        <ArrowRight />
                      </Button>
                    </div>
                  </Tooltip>
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
