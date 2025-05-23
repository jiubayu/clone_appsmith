import { EditorView } from '@codemirror/view'

export const editableConfigure = (editable: boolean) => EditorView.editable.of(editable)
