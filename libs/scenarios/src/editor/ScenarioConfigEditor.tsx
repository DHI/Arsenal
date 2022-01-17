import { FormConfigEditor, Operations } from '@dhi/arsenal.jsonform';
import { useScenariosStore } from '../__state/ScenariosState';
import { ButtonGroup } from '@mui/material';
import { observer, css } from '@dhi/arsenal.ui';
import {
  $Col,
  DeleteIcon,
  CloneIcon,
  ConfirmDropdown,
} from '@dhi/arsenal.ui/x/components';
import { useEffect } from 'react';

export const ScenarioConfigEditor = observer<{
  operations?: Operations;
}>(({ operations }) => {
  const {
    activeScenario,
    isActiveScenarioADraft,
    resetActiveScenarioState,
    createScenario,
    updateScenario,
    scenarioSchema,
    draftScenario,
    deleteScenario,
    cloneScenario,
    setSection,
    activeScenarioWipData,
  } = useScenariosStore();

  useEffect(() => {
    if (!activeScenario?.id) {
      activeScenarioWipData.set(undefined);
      return;
    }

    activeScenarioWipData.set(activeScenario.data);
  }, [activeScenario?.id]);

  if (!activeScenario) return <></>;

  const showConfigActionBar = draftScenario.value?.id !== activeScenario?.id;

  return (
    <$Col grow>
      <FormConfigEditor
        css={css`
          flex-grow: 1;

          .MuiStepper-root {
            padding-left: 1em;
            padding: 0.5em 1em;
          }
        `}
        onData={(data) => activeScenarioWipData.set(data as any)}
        data={activeScenario.data}
        form={scenarioSchema}
        validation={{
          disabled: true,
        }}
        operations={{
          onSave(data: any) {
            if (isActiveScenarioADraft)
              return createScenario({ ...activeScenario, data });

            updateScenario({ ...activeScenario, data });
          },
          onDiscard: resetActiveScenarioState,
          ...operations,
        }}
      />
      {showConfigActionBar && (
        <ButtonGroup
          css={css`
            width: 100%;
            padding: 1em 1.5em;
            box-shadow: 0 2px 3px 0 #0002, 0 -1px 1px 0 #0001;
            position: relative;
          `}
        >
          <ConfirmDropdown
            css={css`
              color: #ff1100ae;
            `}
            trigger={{
              icon: <DeleteIcon />,
              label: <>Delete</>,
            }}
            confirm={{
              icon: <DeleteIcon />,
              label: <>Delete Scenario</>,
              onClick: () => deleteScenario?.(activeScenario.id),
            }}
          />

          <ConfirmDropdown
            trigger={{
              icon: <CloneIcon />,
              label: <>Clone</>,
            }}
            confirm={{
              icon: <CloneIcon />,
              label: <>Clone Scenario</>,
              onClick: () => cloneScenario?.(activeScenario),
            }}
          />
        </ButtonGroup>
      )}
    </$Col>
  );
});
