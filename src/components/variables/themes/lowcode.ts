import { EditorView } from '@codemirror/view'

// import ArrayIcon from '../../assets/icons/array.svg'
// import BooleanIcon from '../../assets/icons/boolean.svg'
// import FunctionIcon from '../../assets/icons/function.svg'
// import KeywordIcon from '../../assets/icons/keyword.svg'
// import NullIcon from '../../assets/icons/null.svg'
// import NumberIcon from '../../assets/icons/number.svg'
// import ObjectIcon from '../../assets/icons/object.svg'
// import StringIcon from '../../assets/icons/string.svg'
// import TableIcon from '../../assets/icons/table.svg'
// import TypeIcon from '../../assets/icons/type.svg'
// import UnknownIcon from '../../assets/icons/undefine.svg'

const baseUrl = 'https://builder.illacloud.com/assets'

const ArrayIcon = `${baseUrl}/array-39339b58.svg`
const BooleanIcon = `${baseUrl}/function-70d94a1b.svg`
const FunctionIcon = `${baseUrl}/function-70d94a1b.svg`
const KeywordIcon = `${baseUrl}/function-70d94a1b.svg`
const NullIcon = `${baseUrl}/function-70d94a1b.svg`
const NumberIcon = `${baseUrl}/number-a0d2d6bc.svg`
const ObjectIcon = `${baseUrl}/object-9716bd48.svg`
const StringIcon = `${baseUrl}/function-70d94a1b.svg`
const TableIcon = `${baseUrl}/function-70d94a1b.svg`
const TypeIcon = `${baseUrl}/function-70d94a1b.svg`
const UnknownIcon = `${baseUrl}/undefine-27337fe9.svg`

export const defaultHighlightClassName = 'cm-default-highlight'
export const errorHighlightClassName = 'cm-error-highlight'

export const themeLowcode = EditorView.theme({
    // editor
    '&.cm-editor': {
        // borderRadius: '8px',
        // border: '1px solid rgb(229, 230, 235)',
        overflow: 'hidden',
        outline: 'none',
    },
    '&.cm-editor .cm-scroller': {
        lineHeight: '22px',
        fontSize: '12px',
    },
    '&.cm-editor .cm-content': {
        padding: '4px 0',
    },
    '&.cm-editor .cm-line': {
        padding: '0 16px',
    },
    '&.cm-editor.cm-focused .cm-matchingBracket': {
        color: 'rgba(0, 170, 91, 1)',
    },
    '&.cm-editor .cm-placeholder': {
        color: 'rgba(0, 0, 0, 0.3)',
        height: 0,
    },
    '&.cm-editor .cm-gutters .cm-gutter .cm-gutterElement': {
        padding: '0 8px 0 23px',
    },
    '&.cm-editor .cm-gutters': {
        // borderRadius: '8px 0 0 8px',
        // borderRight: 'none',
    },
    // tooltip
    '.cm-tooltip.cm-tooltip-autocomplete': {
        border: 'none',
        borderRadius: '8px',
        padding: '2px',
        backgroundColor: 'white',
    },
    '.cm-tooltip.cm-tooltip-autocomplete > ul': {
        backgroundColor: "getColor('white', '01')",
        border: "1px solid getColor('greyBlue', '08')",
        boxShadow: '0 2px 16px rgba(0, 0, 0, 0.16)',
        borderRadius: '8px',
        fontFamily: 'JetBrains Mono, Monaco, Menlo, monospace',
    },
    '.cm-tooltip.cm-tooltip-autocomplete > ul > li': {
        height: '24px',
        lineHeight: '24px',
        position: 'relative',
        overflow: 'hidden',
    },
    '.cm-tooltip.cm-tooltip-autocomplete > ul > li[aria-selected]': {
        backgroundColor: 'rgb(240, 232, 255)',
        color: 'rgb(101, 74, 236)',
    },
    '.cm-tooltip.cm-tooltip-autocomplete > ul > li .cm-completionIcon': {
        width: '14px',
        height: '14px',
        fontSize: '14px',
        opacity: '1',
        paddingRight: '8px',
        position: 'absolute',
        top: '2.5px',
    },
    '.cm-tooltip.cm-tooltip-autocomplete > ul > li .cm-completionIcon-Function:after': {
        content: `url(${FunctionIcon})`,
    },
    '.cm-tooltip.cm-tooltip-autocomplete > ul > li .cm-completionIcon-Number::after': {
        content: `url(${NumberIcon})`,
    },
    '.cm-tooltip.cm-tooltip-autocomplete > ul > li .cm-completionIcon-String::after': {
        content: `url(${StringIcon})`,
    },
    '.cm-tooltip.cm-tooltip-autocomplete > ul > li .cm-completionIcon-Boolean::after': {
        content: `url(${BooleanIcon})`,
    },
    '.cm-tooltip.cm-tooltip-autocomplete > ul > li .cm-completionIcon-Null::after': {
        content: `url(${NullIcon})`,
    },
    '.cm-tooltip.cm-tooltip-autocomplete > ul > li .cm-completionIcon-Object::after': {
        content: `url(${ObjectIcon})`,
    },
    '.cm-tooltip.cm-tooltip-autocomplete > ul > li .cm-completionIcon-Array::after': {
        content: `url(${ArrayIcon})`,
    },
    '.cm-tooltip.cm-tooltip-autocomplete > ul > li .cm-completionIcon-Unknown::after': {
        content: `url(${UnknownIcon})`,
    },
    '.cm-tooltip.cm-tooltip-autocomplete > ul > li .cm-completionIcon-keyword::after': {
        content: `url(${KeywordIcon})`,
    },
    '.cm-tooltip.cm-tooltip-autocomplete > ul > li .cm-completionIcon-type::after': {
        content: `url(${TypeIcon})`,
    },
    '.cm-tooltip.cm-tooltip-autocomplete > ul > li .cm-completionIcon-table::after': {
        content: `url(${TableIcon})`,
    },
    '.cm-tooltip.cm-tooltip-autocomplete > ul > li .cm-completionLabel': {
        fontSize: '12px',
        lineHeight: '22px',
        position: 'absolute',
        left: '25px',
        top: '2px',
    },
    '.cm-tooltip.cm-tooltip-autocomplete > ul > li .cm-completionLabel .cm-completionMatchedText': {
        fontWeight: '600',
        textDecoration: 'none',
    },
    '.cm-tooltip.cm-tooltip-autocomplete > ul > li .cm-completionDetail': {
        position: 'absolute',
        right: '8px',
        top: '2px',
        margin: '0',
        color: 'rgb(169, 174, 184)',
        fontSize: '12px',
        lineHeight: '22px',
        fontStyle: 'normal',
    },
    '.cm-tooltip .cm-completionInfo': {
        padding: '4px 8px',
        backgroundColor: "getColor('white', '01')",
        border: "1px solid getColor('greyBlue', '08')",
        boxShadow: '0 2px 16px rgba(0, 0, 0, 0.16)',
        borderRadius: '8px',
        width: '287px',
    },
    '.cm-tooltip .cm-completionInfo.cm-completionInfo-right': {
        left: 'calc(100% + 8px)',
    },
    '.cm-tooltip .cm-completionInfo .completionInfoCardTitle': {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    '.cm-tooltip .cm-completionInfo .completionInfoCardTitle .cardTitle': {
        width: '100%',
        fontWeight: '500',
        fontSize: '12px',
        lineHeight: '20px',
        color: "getColor('techPurple', '03')",
    },
    '.cm-tooltip .cm-completionInfo .completionInfoCardTitle .openInfo': {
        width: '12px',
        height: '12px',
        display: 'flex',
        alignItems: 'center',
    },
    '.cm-tooltip .cm-completionInfo .completionInfoType': {
        fontSize: '12px',
        color: "getColor('grayBlue', '02')",
        margin: '0',
        lineHeight: '20px',
        wordBreak: 'break-all',
    },
    '.cm-tooltip .cm-completionInfo .completionInfoEvaluatesTitle': {
        fontSize: '12px',
        color: "getColor('grayBlue', '02')",
        margin: '0',
        fontWeight: '500',
        lineHeight: '20px',
    },
    '.cm-tooltip .cm-completionInfo .completionInfoDoc': {
        fontSize: '12px',
        color: "getColor('grayBlue', '04')",
        margin: '0',
        lineHeight: '20px',
    },
    '.cm-tooltip .cm-completionInfo .evaluatesResult': {
        display: 'inline-block',
        margin: '0',
        padding: '0 8px',
        fontSize: '12px',
        lineHeight: '18px',
        color: "getColor('grayBlue', '02')",
        backgroundColor: "getColor('grayBlue', '09')",
        position: 'relative',
        cursor: 'pointer',
    },
    '.cm-tooltip .cm-completionInfo .evaluatesResult:hover .evaluatesTooltips': {
        visibility: 'visible',
    },
    '.cm-tooltip .cm-completionInfo .evaluatesTooltips': {
        visibility: 'hidden',
        fontFamily: 'JetBrains Mono, Monaco, Menlo, monospace',
        position: 'absolute',
        left: 'calc(100% + 4px)',
        top: '-50%',
        maxHeight: '162px',
        borderRadius: '4px',
        boxShadow: '0 2px 16px rgba(0, 0, 0, 0.16)',
        backgroundColor: "getColor('grayBlue', '01')",
        padding: '12px 16px',
        fontSize: '14px',
        lineHeight: '18px',
        color: "getColor('white', '01')",
        whiteSpace: 'pre',
        overflowY: 'auto',
        cursor: 'auto',
    },
    [`.${defaultHighlightClassName}`]: {
        color: 'rgba(0, 170, 91, 1)',
        backgroundColor: 'rgba(0, 170, 91, 0.08);',
    },
    [`.${errorHighlightClassName}`]: {
        color: 'rgba(255, 71, 71, 1)',
        backgroundColor: 'rgba(255, 71, 71, 0.08);',
    },
    // 自定义
    '.dynamic-highlight': {
        color: '#d73a49',
        'font-weight': 'bold',
    },
})
