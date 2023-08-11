import {
  Button,
  Checkbox,
  InputAdornment,
  TextField,
  Typography,
} from '@mui/material';
import { observer, css } from '@dhi/arsenal.ui';
import { SidebarPanel } from './__common/SidebarPanel';
import {
  CloseIcon,
  SearchIcon,
  SimpleList,
} from '@dhi/arsenal.ui/x/components';
import { useScenariosStore } from './__state/ScenariosState';
import { ScenarioListItem } from './__common/ScenarioListItem';
import { ScenarioClasses, ScenarioJobStatus } from './types';
import { $ProgressBar } from './__common/$ProgressBar';
import { ScenarioInstance } from '.';
import { PostAdd as CreateIcon } from '@mui/icons-material';
import { OverlayScrollbar } from './__common/OverlayScrollbar';

// import ScenarioIcon from '@mui/icons-material/ArrowRight';
export const ScenarioListPanel = observer<{
  /** When `true` list items cannot be clicked */
  isSelectingDisabled?: boolean;
  isMinimized?: boolean;
  categorize?: {
    /** Like byJobStatuses but you provide the categorizer */
    byFilter?: {
      title: string | null;
      /** Return true to include a scenario, false to exclude */
      filter(scenario: ScenarioInstance): boolean;
      hideWhenEmpty?: boolean;
    }[];
    /**
     * Categorizes by job status.
     * If `title` is null, no title will be displayed
     * If `null` is provided in the `statuses` array, all scenarios without a job status will be included
     */
    byJobStatuses?: {
      title: string | null;
      /** Title will not be shown when no scenarios match */
      hideWhenEmpty?: boolean;
      statuses: (ScenarioJobStatus | null)[];
    }[];
  };
  checkboxes?: {
    isCheckable?(scenario: ScenarioInstance): boolean;
    enabled?: boolean;
    checkedIds?: string[];
    onChecked?(id: string, checked: boolean): void;
  };
}>(
  ({
    checkboxes,
    isSelectingDisabled,
    isMinimized = false,
    categorize,
  }): JSX.Element => {
    const {
      scenarioListSearchText,
      draftScenario,
      searchFilteredScenarioList,
      activeScenario,
      startDraftScenario,
      setScenario,
      config: {
        behaviour: {
          canFilterScenarios = true,
          canCreateScenarios = true,
        } = {},
        scenarioDataNameKey,
        scenarioList,
      },
    } = useScenariosStore();

    const filteredScenarios = searchFilteredScenarioList.map(
      ({ item }) => item,
    );

    const scenarioGroupings = (() => {
      const draftCategories = draftScenario.value
        ? [
            {
              title: null,
              hideWhenEmpty: true,
              scenarios: [draftScenario.value],
            },
          ]
        : [];

      if (categorize?.byFilter) {
        const scenariosGroupedByFilter = categorize.byFilter.map(
          ({ title, filter, hideWhenEmpty }) => {
            const scenarios = filteredScenarios.filter((s) => filter(s));

            return { title, scenarios, hideWhenEmpty };
          },
        );

        return [...draftCategories, ...scenariosGroupedByFilter];
      } else if (categorize?.byJobStatuses) {
        const scenariosGroupedByStatuses = categorize.byJobStatuses.map(
          ({ title, statuses, hideWhenEmpty }) => {
            const scenarios = filteredScenarios.filter((scenario) => {
              if (statuses.includes(null) && !scenario.job?.status) return true;
              if (!scenario.job?.status) return false;

              return statuses.includes(scenario.job.status);
            });

            return { title, scenarios, hideWhenEmpty };
          },
        );

        return [...draftCategories, ...scenariosGroupedByStatuses];
      }

      return [
        ...draftCategories,
        { title: null, hideWhenEmpty: false, scenarios: filteredScenarios },
      ];
    })();

    return (
      <SidebarPanel
        className={ScenarioClasses.ScenarioListPanel}
        isOpen={!isMinimized}
        css={css`
          && {
            z-index: 2;
          }
        `}
      >
        {scenarioList.isPending && <$ProgressBar />}
        <SimpleList
          showDivider
          css={css`
            padding-bottom: 0;
            padding: 0;
          `}
          items={[
            ...(canFilterScenarios
              ? [
                  {
                    id: 'search',
                    icon: <SearchIcon />,
                    text: (
                      <TextField
                        placeholder="Filter scenarios..."
                        value={scenarioListSearchText.value ?? ''}
                        size="small"
                        onChange={(e) =>
                          scenarioListSearchText.set(e.target.value)
                        }
                        InputProps={{
                          endAdornment: (
                            <InputAdornment
                              position="end"
                              onClick={() =>
                                scenarioListSearchText.set(undefined)
                              }
                              css={css`
                                cursor: pointer;
                                transition: all 0.2s;
                                opacity: ${scenarioListSearchText.value ===
                                undefined
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
                ]
              : []),
            ...(canCreateScenarios
              ? [
                  {
                    id: 'createScenario',
                    text: (
                      <>
                        <Button
                          variant="contained"
                          color="primary"
                          endIcon={<CreateIcon />}
                          css={css`
                            width: 100%;
                          `}
                        >
                          Create New Scenario
                        </Button>
                      </>
                    ),
                    onClick() {
                      startDraftScenario();
                    },
                    ListItemProps: {
                      disabled: !!draftScenario.value,
                    },
                  },
                ]
              : []),
          ]}
        />

        <OverlayScrollbar options={{ overflow: { x: 'hidden' } }}>
          {scenarioGroupings.map(({ title, scenarios, hideWhenEmpty }, i) => {
            if (hideWhenEmpty && scenarios.length === 0) return null;

            return (
              <div
                key={title ?? '' + i}
                css={css`
                  /* margin-bottom: 1em; */
                `}
              >
                {title != null && (
                  <Typography
                    variant="h5"
                    color="secondary"
                    css={css`
                      font-weight: 600;
                      padding-left: 0.75em;
                    `}
                    gutterBottom
                  >
                    {title}
                  </Typography>
                )}
                <SimpleList
                  css={css`
                    padding-top: 0;
                  `}
                  showDivider
                  listProps={{ dense: true }}
                  items={scenarios.map((scenario) => {
                    const isActive = scenario.id === activeScenario?.id;
                    const isChecked = checkboxes?.checkedIds?.includes(
                      scenario.id,
                    );

                    return {
                      id: scenario.id,
                      listItemProps: { dense: true },
                      icon: checkboxes?.enabled ? (
                        <Checkbox
                          disabled={
                            isChecked
                              ? false
                              : !checkboxes.isCheckable?.(scenario) ?? true
                          }
                          checked={isChecked}
                          onChange={(e, checked) =>
                            checkboxes?.onChecked?.(scenario.id, checked)
                          }
                        />
                      ) : undefined,
                      text: (
                        <ScenarioListItem
                          scenario={scenario}
                          isDraft={scenario.id === draftScenario.value?.id}
                          title={scenario?.data?.[scenarioDataNameKey]}
                        />
                      ),
                      onClick: isSelectingDisabled
                        ? undefined
                        : () => setScenario(scenario.id),
                      isSelected: isActive,
                      arrow: 'right' as const,
                    };
                  })}
                />
              </div>
            );
          })}
        </OverlayScrollbar>
      </SidebarPanel>
    );
  },
);
