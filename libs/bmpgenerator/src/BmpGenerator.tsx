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
import styled from '@emotion/styled';
import { BooleanModel, StateModel } from '@dhi/arsenal.models';
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
  className?: string;
  serviceUrl: string;
  replacements?: ReplacementProps;
  onEditor?(editor: DocumentEditorContainer): void;
  RenderedDocumentContainer(props: { children: React.ReactNode }): JSX.Element;
  showDocumentRender: boolean;
}>(
  ({
    serviceUrl,
    replacements = {},
    onEditor,
    className,
    RenderedDocumentContainer,
    showDocumentRender,
  }) => {
    const editorRef = React.useRef<null | DocumentEditorContainer>(null);
    const renderedEditorRef = React.useRef<null | DocumentEditorContainer>(
      null,
    );
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

          renderedDocumentEditor = new StateModel<
            DocumentEditorContainer | undefined
          >(undefined);

          isPreviewOpen = new BooleanModel(false);

          replacements = new StateModel<ReplacementProps | undefined>(
            undefined,
          );

          get editor() {
            return this.documentEditor.value;
          }

          get renderingEditor() {
            return this.renderedDocumentEditor.value;
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

          loadDocumentRender = async () => {
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

              this.loadRender(text);
            });

            file.readAsDataURL(blob);
          };

          loadRender = (text: string) => {
            console.log({
              documentText: text,
              editor: this.renderingEditor?.documentEditor,
            });

            this.renderingEditor?.documentEditor.open(text);
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
      if (renderedEditorRef.current) {
        console.log({
          'renderedEditorRef.current': renderedEditorRef.current,
        });

        state.renderedDocumentEditor.set(renderedEditorRef.current);
        state.initEditor(state.renderedDocumentEditor.value);
      }
    }, [renderedEditorRef.current]);

    React.useEffect(() => {
      state.replacements.set(replacements);
    }, [replacements]);

    React.useEffect(() => {
      if (showDocumentRender) {
        state.loadDocumentRender();
      }
    }, [showDocumentRender]);

    return (
      <>
        <$EditorWrapper {...{ className }}>
          <DocumentEditorContainerComponent
            ref={editorRef as any}
            documentChange={(e) => {
              state.documentLastChanged.set(Date.now());
            }}
            height={'100%'}
            serviceUrl={serviceUrl}
            enableToolbar
            showPropertiesPane={false}
            enableComment={false}
            toolbarItems={[
              'New',
              'Open',
              'Separator',
              'Undo',
              'Redo',
              'Separator',
              'Image',
              'Table',
              'Hyperlink',
              'Bookmark',
              'TableOfContents',
              'Separator',
              'Header',
              'Footer',
              'Separator',
              'PageSetup',
              'PageNumber',
              'Break',
              'Separator',
              'InsertFootnote',
              'InsertEndnote',
              'Separator',
              'Find',
            ]}
          />
        </$EditorWrapper>
        <RenderedDocumentContainer>
          {/* this is preventing the renderedEditorRef from working. Need to mount it with a portal or something?? */}
          <DocumentEditorContainerComponent
            ref={renderedEditorRef as any}
            height={'100%'}
            serviceUrl={serviceUrl}
            restrictEditing
            showPropertiesPane={false}
            enableToolbar={false}
            enableComment={false}
          />
        </RenderedDocumentContainer>
      </>
    );
  },
);

const $EditorWrapper = styled.div`
  width: 100%;
  height: 100%;
`;
