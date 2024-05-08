declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    facebook: {
      /**
       * Add an image
       */

      insertFacebook: (url?: string) => ReturnType
    }
  }
}

import { Node, mergeAttributes } from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'
import FacebookEmbed from './FacebookEmbed'

export const Facebook = Node.create({
  name: 'facebook',
  group: 'block',
  content: 'inline*',
  draggable: true,

  // content: 'inline*',

  parseHTML() {
    return [
      {
        tag: 'facebook-component',
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
    return ['facebook-component', mergeAttributes(HTMLAttributes), 0]
  },

  addNodeView() {
    return ReactNodeViewRenderer(FacebookEmbed)
  },

  addCommands() {
    return {
      insertFacebook:
        (url) =>
        ({ commands, state }) => {
          return commands.insertContent({
            type: 'facebook',
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
