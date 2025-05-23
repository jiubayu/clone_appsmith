import { CompletionContext } from '@codemirror/autocomplete'

export function staticCompletion(context: CompletionContext) {
    const word = context.matchBefore(/{{\s*/) // 匹配输入的当前单词
    if (word === null || (word && word.from === word.to)) return null // 如果没有输入，返回空

    // 真正的options 是由语法服务器返回，LSP(Language Server Protocol)
    return {
        from: word ? word.to : context.pos,
        validFor: /^\w*$/,
        options: [
            { label: 'function', type: 'keyword', detail: 'Keyword' },
            { label: 'const', type: 'keyword', detail: 'Keyword' },
            { label: 'let', type: 'keyword', detail: 'Keyword' },
            { label: 'var', type: 'keyword', detail: 'Keyword' },
            { label: 'user', type: 'Object', detail: 'Object' },
            { label: 'currentUser', type: 'Object', detail: 'Object' },
            // { label: 'console.log', type: 'function', info: 'Log to console' },
            { label: 'console', type: 'Function', detail: 'Function' },
        ],
    }
}
