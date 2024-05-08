declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    twitter: {
      /**
       * Add an image
       */

      insertTwitter: (url?: string) => ReturnType
    }
  }
}

import { Node, PasteRule, markPasteRule, mergeAttributes } from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'
import TwitterEmbed from './TwitterEmbed'

export const Twitter = Node.create({
  name: 'twitter',

  group: 'block',
  content: 'inline*',
  draggable: true,

  // content: 'inline*',

  parseHTML() {
    return [
      {
        tag: 'twitter-component',
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
    return ['twitter-component', mergeAttributes(HTMLAttributes), 0]
  },

  addNodeView() {
    return ReactNodeViewRenderer(TwitterEmbed)
  },

  addCommands() {
    return {
      insertTwitter:
        (url) =>
        ({ commands, state }) => {
          return commands.insertContent({
            type: 'twitter',
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
