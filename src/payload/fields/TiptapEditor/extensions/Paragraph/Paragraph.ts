import { isRTL } from '@/lib/isRTL'
import { mergeAttributes } from '@tiptap/core'
import TiptapParagraph from '@tiptap/extension-paragraph'

export const Paragraph = TiptapParagraph.extend({
  renderHTML({ node, HTMLAttributes }) {
    return [
      `p`,
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        dir: isRTL(node?.textContent ?? '') ? 'rtl' : 'ltr',
      }),
      0,
    ]
  },
})

export default Paragraph
