import { FormConfigEditor } from '@dhi/arsenal.jsonform';
import { useScenariosStore } from '../__state/ScenariosState';
import { ButtonGroup } from '@mui/material';
import { observer, css, PropsOf } from '@dhi/arsenal.ui';
import {
  $Col,
  DeleteIcon,
  CloneIcon,
  ConfirmDropdown,
} from '@dhi/arsenal.ui/x/components';
import { useEffect } from 'react';

export type ConfigEditorProps = Pick<
  Partial<PropsOf<typeof FormConfigEditor>>,
  'className' | 'operations' | 'onData' | 'onInit' | 'validation' | 'readOnly'
>;

export const ScenarioConfigEditor = observer<{
  editor?: ConfigEditorProps;
}>(({ editor = {} }) => {
  const {
    activeScenario,
    isActiveScenarioADraft,
    scenarioSchema,
    draftScenario,
    activeWipScenario,
    resetActiveScenarioState,
    createScenario,
    updateScenario,
    deleteScenario,
    cloneScenario,
  } = useScenariosStore();

  useEffect(() => {
    if (!activeScenario?.id) {
      activeWipScenario.set(undefined);
    } else {
      activeWipScenario.set({
        ...activeScenario,
        data: { ...activeScenario.data },
      });
    }

    return () => activeWipScenario.set(undefined);
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
        {...editor}
        onData={(data) => {
          activeWipScenario.set({
            ...(activeWipScenario.value as any),
            data,
          });

          editor.onData?.(data);
        }}
        data={activeScenario.data}
        form={scenarioSchema}
        operations={{
          onDiscard: resetActiveScenarioState,
          onSave(data: any) {
            if (editor.readOnly) return;

            if (isActiveScenarioADraft)
              return createScenario({ ...activeScenario, data });

            updateScenario({ ...activeScenario, data });
          },

          ...(editor.operations ?? {}),
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
