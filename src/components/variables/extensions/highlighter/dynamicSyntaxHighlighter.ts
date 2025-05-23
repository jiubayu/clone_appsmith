import { RangeSetBuilder } from '@codemirror/state'
import { Decoration, EditorView } from '@codemirror/view'

// 高亮路径的正则表达 匹配user
const dynamicHighlightRegex = /\b(?:user(?:\.\w+)*)\b/g

// 自定义高亮插件
function customHighlight(view: EditorView) {
    const builder = new RangeSetBuilder<Decoration>()
    const text = view.state.doc.toString()

    // 遍历所有匹配项并为其添加高亮
    for (let match; (match = dynamicHighlightRegex.exec(text)); ) {
        const from = match.index
        const to = from + match[0].length

        // 为匹配项添加高亮
        builder.add(
            from,
            to,
            Decoration.mark({
                class: 'dynamic-highlight',
            })
        )
    }
    return builder.finish()
}

// 创建装饰器插件
export const customHighlighterPlugin = EditorView.decorations.compute(['doc'], state => {
    return customHighlight({ state } as EditorView)
})
