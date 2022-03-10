import { ScenarioListPanel } from './ScenarioListPanel';
import { useScenariosStore } from './__state/ScenariosState';
import { ReactNode, Ref, useEffect } from 'react';
import { ActiveScenarioPanel } from './ActiveScenarioPanel';
import { observer, css, PropsOf } from '@dhi/arsenal.ui';
import { $Row } from '@dhi/arsenal.ui/x/components';

type Props = PropsOf<typeof ActiveScenarioPanel> & {
  className?: string;
  appendAfterScenarioPanel?: ReactNode;
  muiTheme?: Record<any, any>;
  refs?: {
    mainPanel?: Ref<any>;
  };
};

export const ScenariosPanels = observer<Props>(
  ({ className, appendAfterScenarioPanel, muiTheme, refs, ...props }) => {
    const { fetchJobsList, fetchScenarioList, startPollingJobsList } =
      useScenariosStore();

    useEffect(() => {
      fetchScenarioList();
      fetchJobsList();
      startPollingJobsList();
    }, []);

    return (
      <$Row
        css={css`
          align-items: stretch;
          z-index: 1;
        `}
        ref={refs?.mainPanel}
        {...{ className }}
      >
        <ScenarioListPanel />
        <div
          css={css`
            position: relative;
          `}
        >
          <ActiveScenarioPanel
            refs={{
              detailsPanel: refs?.detailsPanel,
            }}
            append={appendAfterScenarioPanel}
            {...props}
          />
        </div>
      </$Row>
    );
  },
);
