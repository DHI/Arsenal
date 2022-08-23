import { observer, css } from '@dhi/arsenal.ui';
import { useScenariosStore } from './__state/ScenariosState';
import { SidebarPanel } from './__common/SidebarPanel';
import { IconButton, Tab, Tabs } from '@mui/material';
import { CloseIcon, $Col, $Row } from '@dhi/arsenal.ui/x/components';
import { pascalCase } from 'change-case';
import { ReactNode, Ref, useCallback, useEffect } from 'react';
import {
  ConfigEditorProps,
  ScenarioConfigEditor,
} from './editor/ScenarioConfigEditor';
import { ScenarioClasses } from './types';

export const ActiveScenarioPanel = observer<{
  /** Represents additional tabs */
  sections?: ActiveScenarioSectionsInput;
  /** The section is set to this when the active scenario changes */
  /** Form config editor operations */
  editor?: ConfigEditorProps;
  defaultSection?: string;
  append?: ReactNode;
  refs?: {
    detailsPanel?: Ref<any>;
  };
}>(
  ({
    sections = {},
    append,
    editor,
    defaultSection: defaultSectionInput,
    refs,
  }) => {
    const { activeScenario, activeSection, setScenario, setSection } =
      useScenariosStore();

    const ConfigEditorComponent = useCallback(
      function SCE() {
        return <ScenarioConfigEditor editor={editor} />;
      },
      [editor],
    );

    const sectionComponents = {
      [DefaultSections.Config]: ConfigEditorComponent,
      ...sections,
    };

    type SectionKeys = keyof typeof sectionComponents;
    const validSectionKeys = Object.entries(sectionComponents)
      .filter(([key, value]) => !!value)
      .map(([k]) => k);

    const Section = sectionComponents[activeSection as SectionKeys];
    const defaultSection = validSectionKeys.includes(defaultSectionInput!)
      ? defaultSectionInput
      : validSectionKeys[0];

    useEffect(() => {
      if (activeSection && validSectionKeys.includes(activeSection)) return;
      if (!defaultSection) return;

      if (!activeScenario?.id) {
        setSection(undefined);

        return;
      }

      setSection(defaultSection);
    }, [activeScenario?.id, defaultSection, activeSection]);

    useEffect(() => {
      if (activeSection && !validSectionKeys.includes(activeSection))
        setSection(undefined);
    }, [activeScenario?.id, activeSection, validSectionKeys.join('')]);

    return (
      <$Row
        ref={refs?.detailsPanel}
        css={css`
          position: absolute;
          height: 100%;
          align-items: start;
        `}
      >
        <SidebarPanel
          isOpen={!!activeScenario?.id}
          className={ScenarioClasses.ActiveScenarioPanel}
          css={css`
            background-color: #fafafafa;
            box-shadow: 3px 0 8px 0 rgba(0, 0, 0, 0.2);
            transition: all 0.2s ease-in-out;

            && {
              > div {
                height: 100%;
              }
            }
          `}
        >
          <$Col grow>
            <$Row
              grow={false}
              css={css`
                align-items: flex-start;
              `}
            >
              <ScenarioSectionsTabs tabs={validSectionKeys} />
              <IconButton
                css={css`
                  && {
                    box-shadow: -1px 1px 8px 0 #0001;
                    border-radius: 0;
                    border-bottom-left-radius: 4px;
                  }
                `}
                onClick={() => setScenario(undefined)}
              >
                <CloseIcon />
              </IconButton>
            </$Row>
            <$Row
              css={css`
                align-items: flex-start;
                overflow: auto;
              `}
            >
              {Section && <Section />}
            </$Row>
          </$Col>
        </SidebarPanel>
        {append}
      </$Row>
    );
  },
);

export type ActiveScenarioSectionsInput = {
  [k: string]: false | (() => JSX.Element);
};

export enum DefaultSections {
  Config = 'Config',
}

const ScenarioSectionsTabs = observer<{
  tabs?: string[];
}>(({ tabs = [] }) => {
  const scenarios = useScenariosStore();
  const { activeSection, setSection } = scenarios;

  return (
    <$Row>
      <Tabs value={activeSection ?? ''} onChange={(_, v) => setSection(v)}>
        {[...tabs].map((key) => (
          <Tab key={key} value={key} label={pascalCase(key)} />
        ))}
        <Tab hidden value="" />
      </Tabs>
    </$Row>
  );
});
