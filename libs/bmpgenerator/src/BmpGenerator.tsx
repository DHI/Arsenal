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
  SfdtExport,
  WordExport,
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

DocumentEditorContainerComponent.Inject(
  Toolbar,
  Search,
  Editor,
  OptionsPane,
  SfdtExport,
  WordExport,
);

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

export { DocumentEditorContainer };

export const BmpGenerator = observer<{
  serviceUrl: string;
  replacements?: ReplacementProps;
  onEditor?(editor: DocumentEditorContainer): void;
}>(({ serviceUrl, replacements = {}, onEditor }) => {
  const editorRef = React.useRef<null | DocumentEditorContainer>(null);
  const previewEditorRef = React.useRef<null | DocumentEditorContainer>(null);
  const [state] = React.useState(
    () =>
      new (class State {
        constructor() {
          makeAutoObservable(this);

          document.addEventListener('resize', () => {
            this.editor?.refresh();
          });
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

        save = () => {
          const data = this.editor?.documentEditor.serialize();

          console.log({ data });

          this.editor?.documentEditor.save('file.docx', 'Docx');
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
                  textReplacements: [
                    ...(this.replacements.value?.textReplacements ?? []),
                  ],
                  imageReplacements: [
                    ...(this.replacements.value?.imageReplacements ?? []),
                  ],
                  tableReplacements: [
                    ...(this.replacements.value?.tableReplacements ?? []),
                  ],
                } as PreviewBody),
              },
            );

            const text = await res.text();

            this.loadPreview(text);
          });

          file.readAsDataURL(blob);
        };

        loadPreview = (text: string) => {
          console.log({ documentText: text });
          this.previewEditor?.documentEditor.open(text);
        };
      })(),
  );

  React.useEffect(() => {
    if (editorRef.current) {
      state.documentEditor.set(editorRef.current);
      state.initEditor(state.documentEditor.value);
      onEditor?.(state.documentEditor.value!);
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
      <$EditorWrapper>
        <DocumentEditorContainerComponent
          ref={editorRef as any}
          documentChange={(e) => {
            console.log({ e });
            state.documentLastChanged.set(Date.now());
          }}
          height={'100%'}
          serviceUrl={serviceUrl}
          enableToolbar
          toolbarClick={(arg: { item: { id: string } }) => {
            switch (arg.item.id) {
              case previewToolbarButton.id: {
                state.isPreviewOpen.setTrue();
                state.uploadDocumentForPreview();
              }

              case dlDocxToolbarButton.id: {
                state.save();
              }
            }
          }}
          showPropertiesPane={false}
          enableComment={false}
          toolbarItems={[
            'New',
            'Open',
            'Image',
            'Table',
            'Find',
            previewToolbarButton,
            dlDocxToolbarButton,
          ]}
        />
      </$EditorWrapper>
      <Dialog
        open={state.isPreviewOpen.isTrue}
        keepMounted
        fullWidth
        maxWidth="xl"
        css={css`
          && {
            height: 90vh;
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
            enableComment={false}
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
    </>
  );
});

const previewToolbarButton = {
  prefixIcon: 'e-de-ctnr-lock',
  tooltipText: 'Preview Filled',
  text: 'Preview Filled',
  id: 'PreviewFilled',
};

const dlDocxToolbarButton = {
  prefixIcon: 'e-de-ctnr-lock',
  tooltipText: 'Download Template (.docx)',
  text: 'Download Template (.docx)',
  id: 'DownloadDocx',
};

const $EditorWrapper = styled.div`
  width: 100%;
  height: 100%;
`;
