import { syntaxTree } from '@codemirror/language'
import { Diagnostic, linter } from '@codemirror/lint'

export const forbidRegExpDemoLinter = linter(view => {
    const diagnostics: Diagnostic[] = []
    syntaxTree(view.state)
        .cursor()
        .iterate(node => {
            if (node.name === 'RegExp') {
                diagnostics.push({
                    from: node.from,
                    to: node.to,
                    severity: 'error',
                    message: 'RegExp expressions are Forbidden',
                    actions: [
                        {
                            name: 'Remove',
                            apply: (view, from, to) => {
                                view.dispatch({
                                    changes: { from, to },
                                })
                            },
                        },
                    ],
                })
            }
        })

    return diagnostics
})
