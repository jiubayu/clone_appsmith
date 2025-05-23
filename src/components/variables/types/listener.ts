/**
 * 编辑器内容更新监听函数
 */
export interface ChangeUpdateListenerParams {
    onChange?: (value: string) => void
}

/**
 * 编辑器焦点更新监听器函数
 */
export interface FocusUpdateListenerParams {
    onFocus?: () => void
    onBlur?: (value: string) => void
}
