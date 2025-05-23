import { CompletionContext } from '@codemirror/autocomplete'

export function dynamicCompletion(context: CompletionContext) {
    const dynamicOptions = fetchDynamicOptions() // 从外部获取补全数据
    // const word = context.matchBefore(/\w*/)
    const word = context.matchBefore(/.*\{\{\s*/) // 匹配输入的当前单词
    if (word === null || (word && word.from === word.to)) return null // 如果没有输入，返回空
    return {
        // from: word ? word.from : context.pos,
        from: word ? word.from + context.pos : context.pos,
        // validFor: /^\w*$/,
        options: dynamicOptions.map(item => ({ label: item, type: 'keyword' })),
    }
}

const options: string[] = []
let i = 0

setInterval(() => {
    options.push('newOption' + i++)
}, 1000)

function fetchDynamicOptions() {
    // 示例：从服务器获取关键词
    return options
}
