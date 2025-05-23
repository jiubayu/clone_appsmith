import { EditorState } from '@codemirror/state'
import { EditorView } from '@codemirror/view'

export const singleLineConfigure = (singleLine: boolean) =>
    singleLine ? EditorState.transactionFilter.of(tr => (tr.newDoc.lines > 1 ? [] : [tr])) : EditorView.lineWrapping
