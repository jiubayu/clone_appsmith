import { EditorState } from '@codemirror/state'

export const readOnlyConfigure = (readOnly: boolean) => EditorState.readOnly.of(readOnly)
