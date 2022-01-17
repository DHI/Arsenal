import { Typography, CircularProgress } from '@mui/material';
import { css, PropsOf, styled } from '@dhi/arsenal.ui';
import { $Col, CheckIcon, CloseIcon } from '@dhi/arsenal.ui/x/components';
import { RED, YELLOW } from './colors';
import { StyledComponent } from '@emotion/styled/types';

export const ProgressIndicatorCircle = ({
  progressPct,
  progressVariant,
  statusKind,
  isError,
  isComplete,
  isPending,
}: {
  progressPct: number;
  progressVariant: ProgressVariants;
  statusKind?: StatusKinds;
  isError?: boolean;
  isComplete?: boolean;
  isPending?: boolean;
}) => (
  <$Col
    css={css`
      position: relative;
      display: inline-flex;
      margin-left: 1em;
    `}
  >
    <$ProgressIndicator
      value={progressPct}
      variant={progressVariant}
      kind={statusKind as any}
      thickness={4}
      size={28}
    />

    <div
      css={css`
        position: absolute;
        top: 0;
        left: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100%;
        width: 100%;
        margin-left: -2.5px;

        svg {
          font-size: 1em;
        }
      `}
    >
      {(() => {
        if (isError)
          return (
            <CloseIcon
              css={css`
                color: red;
              `}
            />
          );

        if (isComplete) return <CheckIcon color="primary" />;

        if (isPending)
          return (
            <Typography
              variant="caption"
              css={css`
                opacity: 0.8;
                font-size: 0.5rem;
                font-weight: 600;
                margin-bottom: -2px;
              `}
              color="inherit"
            >
              {progressPct}
              <small>
                <sup>%</sup>
              </small>
            </Typography>
          );

        return <>&bull;</>;
      })()}
    </div>
  </$Col>
);

type ProgressIndicatorProps = { kind: StatusKinds };

export const $ProgressIndicator: StyledComponent<
  PropsOf<typeof CircularProgress> & ProgressIndicatorProps
> = styled(CircularProgress)`
  margin: 4px 0;
  margin-right: 5px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
  border-radius: 100%;

  ${({ kind }: any) => {
    const color = (() => {
      switch (kind) {
        case 'error':
          return RED;
        case 'pending':
          return YELLOW;
      }
    })()?.toRgb();

    if (color)
      return css`
        svg {
          color: rgba(${color.r}, ${color.g}, ${color.b}, 0.9);
        }
      `;

    return '';
  }}
`;

export type StatusKinds = 'error' | 'pending';

export type ProgressVariants = 'determinate' | 'indeterminate';
