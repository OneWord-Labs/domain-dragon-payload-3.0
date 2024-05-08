declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    tiktok: {
      /**
       * Add an image
       */

      insertTiktok: (url?: string) => ReturnType
    }
  }
}

import { Node, mergeAttributes } from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'
import TiktokEmbed from './TiktokEmbed'

export const Tiktok = Node.create({
  name: 'tiktok',

  group: 'block',
  content: 'inline*',
  draggable: true,

  // content: 'inline*',

  parseHTML() {
    return [
      {
        tag: 'tiktok-component',
      },
    ]
  },
  addAttributes() {
    return {
      url: { default: null },
    }
  },
  addKeyboardShortcuts() {
    return {
      'Mod-Enter': () => {
        return this.editor
          .chain()
          .insertContentAt(this.editor.state.selection.head, { type: this.type.name })
          .focus()
          .run()
      },
    }
  },

  renderHTML({ HTMLAttributes }) {
    return ['tiktok-component', mergeAttributes(HTMLAttributes), 0]
  },

  addNodeView() {
    return ReactNodeViewRenderer(TiktokEmbed)
  },

  addCommands() {
    return {
      insertTiktok:
        (url) =>
        ({ commands, state }) => {
          return commands.insertContent({
            type: 'tiktok',
            attrs: {
              url,
            },
          })
        },
    }
  },
})

function isValidHttpUrl(string: string) {
  let url

  try {
    url = new URL(string)
  } catch (_) {
    return false
  }

  return url.protocol === 'http:' || url.protocol === 'https:'
}
