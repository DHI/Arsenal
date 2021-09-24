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
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { BooleanModel, StateModel } from '@dhi/arsenal.models';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
} from '@material-ui/core';
import './styles.css';

DocumentEditorContainerComponent.Inject(Toolbar, Search, Editor, OptionsPane);

export interface ReplacementProps {
  textReplacements?: { tag: string; value: string | number }[];
  tableReplacements?: {
    tag: string;
    value: { header: string[]; rows: string[][] };
  }[];
  imageReplacements?: { tag: string; value: string }[];
}
export interface PreviewBody extends ReplacementProps {
  fileName: string;
  documentContent: string;
}

export const BmpGenerator = observer<{
  serviceUrl: string;
  replacements?: ReplacementProps;
}>(({ serviceUrl, replacements = {} }) => {
  const editorRef = React.useRef<null | DocumentEditorContainer>(null);
  const previewEditorRef = React.useRef<null | DocumentEditorContainer>(null);
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

        previewDocumentEditor = new StateModel<
          DocumentEditorContainer | undefined
        >(undefined);

        isPreviewOpen = new BooleanModel(false);

        replacements = new StateModel<ReplacementProps | undefined>(undefined);

        get editor() {
          return this.documentEditor.value;
        }

        get previewEditor() {
          return this.previewDocumentEditor.value;
        }

        initEditor = (editor?: DocumentEditorContainer) => {
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

        uploadDocumentForPreview = async () => {
          const blob = await this.editor!.documentEditor.saveAsBlob('Docx')!;
          const file = new FileReader();

          file.addEventListener('loadend', async (e) => {
            const base64String = file.result;

            const res = await fetch(
              `${serviceUrl}/PreviewParameterReplacement`,
              {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json;charset=UTF-8',
                },
                body: JSON.stringify({
                  fileName: this.editor?.documentEditor.documentName,
                  documentContent: base64String,
                  ...this.replacements.value,
                } as PreviewBody),
              },
            );

            const text = await res.text();

            this.loadPreview(text);
          });

          file.readAsDataURL(blob);
        };

        loadPreview = (text: string) => {
          this.previewEditor?.documentEditor.open(text);
        };
      })(),
  );

  React.useEffect(() => {
    if (editorRef.current) {
      state.documentEditor.set(editorRef.current);
      state.initEditor(state.documentEditor.value);
    }
  }, [editorRef.current]);

  React.useEffect(() => {
    if (previewEditorRef.current) {
      console.log('Setting preview editor', previewEditorRef);
      state.previewDocumentEditor.set(previewEditorRef.current);
      state.initEditor(state.previewDocumentEditor.value);
    }
  }, [previewEditorRef.current]);

  React.useEffect(() => {
    state.replacements.set(replacements);
  }, [replacements]);

  return (
    <>
      <div>
        <Dialog
          open={state.isPreviewOpen.isTrue}
          keepMounted
          fullScreen
          css={css`
            && {
              display: ${state.isPreviewOpen.isTrue ? 'block' : 'none'};
            }
          `}
        >
          <DialogTitle>Document Preview</DialogTitle>
          <DialogContent>
            <DocumentEditorContainerComponent
              ref={previewEditorRef as any}
              height={'100%'}
              serviceUrl={serviceUrl}
              restrictEditing
              showPropertiesPane={false}
              enableToolbar={false}
            />
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                state.isPreviewOpen.setFalse();
              }}
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>
        <$EditorWrapper>
          <DocumentEditorContainerComponent
            ref={editorRef as any}
            documentChange={(e) => state.documentLastChanged.set(Date.now())}
            height={'100%'}
            serviceUrl={serviceUrl}
            enableToolbar
            toolbarClick={(arg: { item: { id: string } }) => {
              switch (arg.item.id) {
                case previewToolbarButton.id: {
                  state.isPreviewOpen.setTrue();
                  state.uploadDocumentForPreview();
                }
              }
            }}
            toolbarItems={[
              'New',
              'Open',
              previewToolbarButton,
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

const previewToolbarButton = {
  prefixIcon: 'e-de-ctnr-lock',
  tooltipText: 'Preview Filled',
  text: 'Preview Filled',
  id: 'PreviewFilled',
};

const $EditorWrapper = styled.div`
  width: 100%;
  height: 90vh;
`;
