import { PasteRule, mergeAttributes } from '@tiptap/core'
import TiptapLink from '@tiptap/extension-link'
import { Plugin } from '@tiptap/pm/state'
import { EditorView } from '@tiptap/pm/view'

export const Link = TiptapLink.extend({
  inclusive: false,

  parseHTML() {
    return [{ tag: 'a[href]:not([data-type="button"]):not([href *= "javascript:" i])' }]
  },

  renderHTML({ HTMLAttributes }) {
    return ['a', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, { class: 'link' }), 0]
  },

  addPasteRules() {
    const twitterRegex = /^https:\/\/twitter\.com\/([a-zA-Z0-9_-]+)\/status\/(\d+)/g
    const instagramRegex = /^https:\/\/www\.instagram\.com\/p\/([A-Za-z0-9_-]+)/g
    const youtubeRegex =
      /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube(-nocookie)?\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|live\/|v\/)?)([\w\-]+)(\S+)?/g

    return [
      new PasteRule({
        find: twitterRegex,
        handler: ({ commands, match, state, pasteEvent, chain }) => {
          const matchUrl = match?.[0]
          chain().selectParentNode().deleteSelection().insertTwitter(matchUrl).run()
        },
      }),
      new PasteRule({
        find: instagramRegex,
        handler: ({ commands, match, state, pasteEvent, chain }) => {
          const matchUrl = match?.[0]
          chain().selectParentNode().deleteSelection().insertInstagram(matchUrl).run()
        },
      }),
      new PasteRule({
        find: youtubeRegex,
        handler: ({ commands, match, state, pasteEvent, chain }) => {
          const matchUrl = match?.[0]
          chain().selectParentNode().deleteSelection().insertYoutube(matchUrl).run()
        },
      }),
    ]
  },
  addProseMirrorPlugins() {
    const { editor } = this

    return [
      ...(this.parent?.() || []),
      new Plugin({
        props: {
          handleKeyDown: (view: EditorView, event: KeyboardEvent) => {
            const { selection } = editor.state

            if (event.key === 'Escape' && selection.empty !== true) {
              editor.commands.focus(selection.to, { scrollIntoView: false })
            }

            return false
          },
        },
      }),
    ]
  },
})

export default Link
