import { EditorView } from '@codemirror/view'

export const themeGrass = EditorView.theme(
    {
        '&': {
            color: 'white',
            backgroundColor: '#034',
        },
        '.cm-content': {
            caretColor: '#0e9',
        },
        '&.cm-focused .cm-cursor': {
            borderLeftColor: '#0e9',
        },
        '&.cm-focused .cm-selectionBackground, ::selection': {
            backgroundColor: '#074',
        },
        '.cm-gutters': {
            backgroundColor: '#045',
            color: '#ddd',
            border: 'none',
        },
    },
    { dark: true }
)
