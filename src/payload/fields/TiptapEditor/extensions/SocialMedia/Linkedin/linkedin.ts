declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    linkedin: {
      /**
       * Add an image
       */

      insertLinkedin: (url?: string) => ReturnType
    }
  }
}

import { Node, mergeAttributes } from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'
import LinkedinEmbed from './LinkedinEmbed'

export const Linkedin = Node.create({
  name: 'linkedin',

  group: 'block',
  content: 'inline*',
  draggable: true,

  parseHTML() {
    return [
      {
        tag: 'linkedin-component',
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
    return ['linkedin-component', mergeAttributes(HTMLAttributes), 0]
  },

  addNodeView() {
    return ReactNodeViewRenderer(LinkedinEmbed)
  },

  addCommands() {
    return {
      insertLinkedin:
        (url) =>
        ({ commands, state }) => {
          return commands.insertContent({
            type: 'linkedin',
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
