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
import { StateModel } from '@dhi/arsenal.models';
import './styles.css';
import { PropsOf } from '@emotion/react';
import AutoSizer from 'react-virtualized-auto-sizer';

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

export class BmpGeneratorState {
  serviceUrl: StateModel<string>;
  constructor({ serviceUrl }: { serviceUrl: string }) {
    this.serviceUrl = new StateModel(serviceUrl);

    makeAutoObservable(this);
  }

  documentEditor = new StateModel<DocumentEditorContainer | undefined>(
    undefined,
  );

  renderedDocumentEditor = new StateModel<DocumentEditorContainer | undefined>(
    undefined,
  );

  replacements = new StateModel<ReplacementProps | undefined>(undefined);

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

  downloadTemplate = () => {
    const data = this.editor?.documentEditor.serialize();

    console.log({ data });

    this.editor?.documentEditor.save('file.docx', 'Docx');
  };

  downloadRender = () => {
    const data = this.renderingEditor?.documentEditor.serialize();

    console.log({ data });

    this.renderingEditor?.documentEditor.save('file.docx', 'Docx');
  };

  loadDocumentRender = async ({
    options = {},
  }: {
    options?: HeadersInit;
  }): Promise<void> => {
    this.renderingEditor?.documentEditor.openBlank();

    const blob = await this.editor!.documentEditor.saveAsBlob('Docx')!;
    const file = new FileReader();

    file.addEventListener('loadend', async (e) => {
      const base64String = file.result;
      const res = await fetch(
        `${this.serviceUrl.value}PreviewParameterReplacement`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json;charset=UTF-8',
            ...options,
          },
          body: JSON.stringify({
            fileName: this.editor?.documentEditor.documentName,
            documentContent: base64String,
            textReplacements: [
              ...(this.replacements.value?.textReplacements ?? []).map(
                ({ tag, value }) => ({
                  tag,
                  value: String(value), // Force strings for now
                }),
              ),
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

      console.log({
        documentText: text,
        editor: this.renderingEditor?.documentEditor,
      });

      this.renderingEditor?.documentEditor.open(text);
    });

    file.readAsDataURL(blob);
  };
}

export const BmpGenerator = observer<{
  className?: string;
  serviceUrl: string;
  replacements?: ReplacementProps;
  onEditor?(editor: DocumentEditorContainer): void;
  onInit?(state: BmpGeneratorState): void;
  renderEditorRef?: React.MutableRefObject<null | DocumentEditorContainer>;
  editorProps?: Partial<PropsOf<typeof DocumentEditorContainerComponent>>;
}>(
  ({
    serviceUrl,
    replacements = {},
    onEditor,
    className,
    renderEditorRef,
    editorProps,
    onInit,
  }) => {
    const editorRef = React.useRef<null | DocumentEditorContainer>(null);
    const [state] = React.useState(
      () =>
        new BmpGeneratorState({
          serviceUrl,
        }),
    );

    React.useEffect(() => {
      onInit?.(state);
    }, []);

    React.useEffect(() => {
      state.serviceUrl.set(serviceUrl);
    }, [serviceUrl]);

    React.useEffect(() => {
      if (editorRef.current) {
        console.log({
          'editorRef.current': editorRef?.current,
        });

        state.documentEditor.set(editorRef.current);
        state.initEditor(state.documentEditor.value);
        onEditor?.(state.documentEditor.value!);
      }
    }, [editorRef.current]);

    React.useEffect(() => {
      if (renderEditorRef?.current) {
        console.log({
          'renderedEditorRef.current': renderEditorRef?.current,
        });

        state.renderedDocumentEditor.set(renderEditorRef?.current);
        state.initEditor(state.renderedDocumentEditor.value);
      }
    }, [renderEditorRef?.current]);

    React.useEffect(() => {
      state.replacements.set(replacements);
    }, [replacements]);

    return (
      <>
        <$EditorWrapper {...{ className }}>
          <AutoSizer defaultHeight={800} defaultWidth={600}>
            {({ height, width }) => (
              <DocumentEditorContainerComponent
                key={serviceUrl}
                ref={editorRef as any}
                height={height + 'px'}
                width={width + 'px'}
                serviceUrl={serviceUrl}
                enableToolbar
                showPropertiesPane={false}
                enableComment={false}
                enableTrackChanges={false}
                immediateRender
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
                {...editorProps}
              />
            )}
          </AutoSizer>
        </$EditorWrapper>
      </>
    );
  },
);

export const BmpGeneratorRenderEditor = observer<{
  editorRef: React.Ref<any>;
  serviceUrl: string;
  editorProps?: Partial<PropsOf<typeof DocumentEditorContainerComponent>>;
}>(({ editorRef, serviceUrl, editorProps }) => {
  return (
    <AutoSizer defaultHeight={800} defaultWidth={600}>
      {({ height, width }) => (
        <DocumentEditorContainerComponent
          key={serviceUrl}
          ref={editorRef as any}
          height={height + 'px'}
          width={width + 'px'}
          serviceUrl={serviceUrl}
          restrictEditing
          showPropertiesPane={false}
          enableToolbar={false}
          enableComment={false}
          enableTrackChanges={false}
          immediateRender
          {...editorProps}
        />
      )}
    </AutoSizer>
  );
});

const $EditorWrapper = styled.div`
  width: 100%;
  height: 100%;
  overflow: hidden;
`;
