import { LinearProgress } from '@mui/material';
import { PropsOf, styled } from '@dhi/arsenal.ui';
import { StyledComponent } from '@emotion/styled';

const ProgressBar = (p: PropsOf<typeof LinearProgress>): JSX.Element => (
  <LinearProgress variant="indeterminate" {...p} />
);

export const $ProgressBar: StyledComponent<
  PropsOf<typeof ProgressBar>
> = styled(ProgressBar)`
  margin-top: 4px;
  width: 100%;
  height: 6px;
`;
