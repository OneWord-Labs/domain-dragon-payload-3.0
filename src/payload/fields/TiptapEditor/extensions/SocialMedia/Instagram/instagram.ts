declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    instagram: {
      /**
       * Add an image
       */

      insertInstagram: (url?: string) => ReturnType
    }
  }
}

import { Node, mergeAttributes } from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'
import InstagramEmbed from './InstagramEmbed'

export const Instagram = Node.create({
  name: 'instagram',

  group: 'block',
  content: 'inline*',
  draggable: true,
  // content: 'inline*',

  parseHTML() {
    return [
      {
        tag: 'instagram-component',
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
    return ['instagram-component', mergeAttributes(HTMLAttributes), 0]
  },

  addNodeView() {
    return ReactNodeViewRenderer(InstagramEmbed)
  },

  addCommands() {
    return {
      insertInstagram:
        (url) =>
        ({ commands, state }) => {
          return commands.insertContent({
            type: 'instagram',
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
