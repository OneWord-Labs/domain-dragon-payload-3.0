declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    youtube: {
      /**
       * Add an image
       */

      insertYoutube: (url?: string) => ReturnType
    }
  }
}

import { Node, PasteRule, markPasteRule, mergeAttributes } from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'
import TwitterEmbed from './YoutubeEmbed'

export const Youtube = Node.create({
  name: 'youtube',

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
      insertYoutube:
        (url) =>
        ({ commands, state }) => {
          return commands.insertContent({
            type: 'youtube',
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
