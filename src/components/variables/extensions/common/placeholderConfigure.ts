import { placeholder as placeholderExtension } from '@codemirror/view'

export const placeholderConfigure = (placeholder?: string) => {
    return typeof placeholder === 'string' ? placeholderExtension(placeholder) : []
}
