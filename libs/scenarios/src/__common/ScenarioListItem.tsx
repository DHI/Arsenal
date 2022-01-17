import { css, observer } from '@dhi/arsenal.ui';
import { $Col, $Row } from '@dhi/arsenal.ui/x/components';
import { ScenarioConfig, ScenarioInstance, ScenarioJobStatus } from '../types';
import { ProgressIndicatorCircle } from './ProgressIndicatorCircle';

export const ScenarioListItem = observer<{
  scenario: ScenarioInstance<ScenarioConfig, any>;
  isDraft?: boolean;
  className?: string;
}>(({ scenario, isDraft, className }) => {
  const isComplete = scenario.job?.status === ScenarioJobStatus.Completed;
  const isError = scenario.job?.status === ScenarioJobStatus.Error;

  const isPending =
    scenario.job?.status === ScenarioJobStatus.Pending ||
    scenario.job?.status === ScenarioJobStatus.InProgress;
  const progressPct = isComplete ? 100 : scenario.job?.progress ?? 0;

  const progressVariant =
    scenario.job?.status === 'Pending' ? 'indeterminate' : 'determinate';

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
        {scenario.data?.Name}
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
