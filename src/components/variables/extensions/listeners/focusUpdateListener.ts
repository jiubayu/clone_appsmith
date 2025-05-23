import { EditorView } from '@codemirror/view'

import { FocusUpdateListenerParams } from '../../types/listener'

export const focusUpdateListener = (params: FocusUpdateListenerParams) =>
    EditorView.updateListener.of(update => {
        const { onFocus, onBlur } = params
        if (update.focusChanged) {
            if (update.view.hasFocus) onFocus?.()
            else onBlur?.(update.state.doc.toString())
        }
    })
