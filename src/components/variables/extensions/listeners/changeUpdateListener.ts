import { EditorView } from '@codemirror/view'

import { ChangeUpdateListenerParams } from '../../types/listener'

export const changeUpdateListener = (params: ChangeUpdateListenerParams) =>
    EditorView.updateListener.of(update => {
        if (update.docChanged) params.onChange?.(update.state.doc.toString())
    })
