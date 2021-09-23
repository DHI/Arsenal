import * as React from 'react';
import { observer } from 'mobx-react-lite';
import { makeAutoObservable } from 'mobx';
import {
  DocumentEditorContainer,
  DocumentEditorContainerComponent,
  Toolbar,
  Search,
  OptionsPane,
  Editor,
} from '@syncfusion/ej2-react-documenteditor';
import { styled } from '@dhi/arsenal.ui';
import { BooleanModel, StateModel } from '@dhi/arsenal.models';
import './styles.css';

DocumentEditorContainerComponent.Inject(Toolbar, Search, Editor, OptionsPane);

export const BmpGenerator = observer<{
  serviceUrl: string;
  variables?: Record<string, string | number>;
}>(({ serviceUrl, variables = {} }) => {
  const editorRef = React.useRef<null | DocumentEditorContainer>(null);
  const [state] = React.useState(
    () =>
      new (class State {
        constructor() {
          makeAutoObservable(this);
        }

        documentIsReady = new BooleanModel(false);
        documentLastChanged = new StateModel(Date.now());
        documentEditor = new StateModel<DocumentEditorContainer | undefined>(
          undefined,
        );

        get editor() {
          return this.documentEditor.value;
        }

        initEditor = () => {
          const editor = this.editor;

          if (!editor) return;

          editor.resize();
        };

        findReplaceVariables = async (
          vars: Record<string, string | number>,
        ) => {
          const editor = this.editor;

          if (!editor) return;

          console.log('Replacing...');

          for (const [key, value] of Object.entries(vars)) {
            editor.documentEditor.searchModule.findAll(`{${key}}`);

            if (editor.documentEditor.searchModule.searchResults.length) {
              editor.documentEditor.searchModule.searchResults.replaceAll(
                value as string,
              );
            }

            editor.documentEditor.searchModule.searchResults.clear();
          }
        };
      })(),
  );

  React.useEffect(() => {
    if (editorRef.current) {
      state.documentEditor.set(editorRef.current);
      state.initEditor();
    }
  }, [editorRef.current]);

  return (
    <>
      <div>
        <button
          onClick={() => {
            state.findReplaceVariables(variables);
          }}
        >
          Replace Variables
        </button>
        <$EditorWrapper>
          <DocumentEditorContainerComponent
            ref={editorRef as any}
            documentChange={(e) => state.documentLastChanged.set(Date.now())}
            height={'100%'}
            serviceUrl={serviceUrl}
            enableToolbar
            toolbarItems={[
              'FormFields',
              'New',
              'Open',
              'Image',
              'Table',
              'Hyperlink',
              'Bookmark',
              'PageSetup',
              'PageNumber',
              'Break',
              'Find',
              'LocalClipboard',
            ]}
          />
        </$EditorWrapper>
      </div>
    </>
  );
});

const $EditorWrapper = styled.div`
  width: 100%;
  height: 90vh;
`;
