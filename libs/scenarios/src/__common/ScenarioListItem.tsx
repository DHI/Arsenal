import { css, observer } from '@dhi/arsenal.ui';
import { $Col, $Row } from '@dhi/arsenal.ui/x/components';
import { ScenarioInstance, ScenarioJobStatus } from '../types';
import { ProgressIndicatorCircle } from './ProgressIndicatorCircle';

export const ScenarioListItem = observer<{
  scenario: ScenarioInstance;
  isDraft?: boolean;
  className?: string;
  title?: string;
}>(({ scenario, isDraft, title, className }) => {
  const status = scenario.job?.status?.toUpperCase();
  const isComplete = status === ScenarioJobStatus.Completed;
  const isError = status === ScenarioJobStatus.Error;
  const isPending =
    status === ScenarioJobStatus.Pending ||
    status === ScenarioJobStatus.InProgress;

  const progressPct = isComplete ? 100 : scenario.job?.progress ?? 0;
  const progressVariant =
    status === ScenarioJobStatus.Pending ? 'indeterminate' : 'determinate';

  const statusKind = (() => {
    if (isError) return 'error';
    if (isPending) return 'pending';
  })();

  return (
    <$Row
      css={css`
        justify-content: space-between;
      `}
      {...{ className }}
    >
      <$Col
        css={css`
          padding-right: 0.5em;
        `}
      >
        {isDraft ? <>[ DRAFT ]&nbsp;</> : <></>}
        {title}
      </$Col>
      <ProgressIndicatorCircle
        {...{
          progressPct,
          progressVariant,
          statusKind,
          isError,
          isComplete,
          isPending,
        }}
      />
    </$Row>
  );
});
