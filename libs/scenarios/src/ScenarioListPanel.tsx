import { InputAdornment, TextField } from '@mui/material';
import { observer, css } from '@dhi/arsenal.ui';
import { SidebarPanel } from './__common/SidebarPanel';
import {
  CloseIcon,
  ConfigIcon,
  OpenNewIcon,
  SearchIcon,
  SimpleList,
} from '@dhi/arsenal.ui/x/components';
import { useScenariosStore } from './__state/ScenariosState';
import { ScenarioListItem } from './__common/ScenarioListItem';
import { ScenarioClasses } from './types';
import { $ProgressBar } from './__common/$ProgressBar';

export const ScenarioListPanel = observer((): JSX.Element => {
  const {
    scenarioListSearchText,
    data,
    draftScenario,
    searchFilteredScenarioList,
    activeScenario,
    startDraftScenario,
    setScenario,
  } = useScenariosStore();

  return (
    <SidebarPanel
      className={ScenarioClasses.ScenarioListPanel}
      css={css`
        && {
          z-index: 2;
        }
      `}
    >
      {data.scenarioList.isPending && <$ProgressBar />}
      <SimpleList
        showDivider
        items={[
          {
            id: 'search',
            icon: <SearchIcon />,
            text: (
              <TextField
                placeholder="Filter scenarios..."
                value={scenarioListSearchText.value ?? ''}
                onChange={(e) => scenarioListSearchText.set(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment
                      position="end"
                      onClick={() => scenarioListSearchText.set(undefined)}
                      css={css`
                        cursor: pointer;
                        transition: all 0.2s;
                        opacity: ${scenarioListSearchText.value === undefined
                          ? 0.4
                          : 1};
                      `}
                    >
                      <CloseIcon />
                    </InputAdornment>
                  ),
                }}
              />
            ),
          },
          {
            id: 'createScenario',
            icon: <OpenNewIcon />,
            text: <>Create New Scenario</>,
            onClick() {
              startDraftScenario();
            },
            ListItemProps: {
              disabled: !!draftScenario.value,
            },
          },
        ]}
      />

      <SimpleList
        css={css`
          overflow-y: auto;
          overflow-x: hidden;
          padding-top: 0;
        `}
        showDivider
        listProps={{ dense: true }}
        items={[
          ...[
            ...(draftScenario.value
              ? [
                  {
                    item: draftScenario.value,
                  },
                ]
              : []),
            ...searchFilteredScenarioList,
          ].map((s) => {
            const { item } = s;
            const { id } = item;
            const isActive = id === activeScenario?.id;

            return {
              id,
              icon: (
                <ConfigIcon
                  css={css`
                    opacity: 0.5;
                  `}
                />
              ),
              text: (
                <ScenarioListItem
                  scenario={item}
                  isDraft={id === draftScenario.value?.id}
                  title={item.data[data.scenearioDataNameKey]}
                />
              ),
              onClick() {
                setScenario(id);
              },
              isSelected: isActive,
              arrow: 'right' as const,
            };
          }),
        ]}
      />
    </SidebarPanel>
  );
});
