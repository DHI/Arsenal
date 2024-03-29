import { ScenarioListPanel } from './ScenarioListPanel';
import { ReactNode, Ref } from 'react';
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
  listing?: PropsOf<typeof ScenarioListPanel>;
};

export const ScenariosPanels = observer<Props>(
  ({
    className,
    appendAfterScenarioPanel,
    muiTheme,
    refs,
    listing,
    ...props
  }) => (
    <$Row
      css={css`
        align-items: stretch;
        z-index: 1;
      `}
      ref={refs?.mainPanel}
      {...{ className }}
    >
      <ScenarioListPanel {...listing} />
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
  ),
);
