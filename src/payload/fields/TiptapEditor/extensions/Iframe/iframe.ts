declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    iframe: {
      /**
       * Add an image
       */

      setHtml: (value: string) => ReturnType
    }
  }
}

import { Node, mergeAttributes } from '@tiptap/core'

export const Iframe = Node.create({
  name: 'iframe',
  inline: false,
  group: 'block',

  addOptions() {
    return {
      HTMLAttributes: { frameborder: 0 },
    }
  },

  addAttributes() {
    return {
      src: { default: null },
      editorValue: { default: null },
      HTMLAttributes: {
        default: null,
        renderHTML: (attributes) => {
          return attributes.HTMLAttributes || {}
        },
      },
    }
  },

  parseHTML() {
    return [{ tag: 'iframe' }]
  },

  addNodeView() {
    return ({ editor, node }) => {
      const div = document.createElement('div')
      div.className = 'aspect-w-16 aspect-h-9' + (editor.isEditable ? ' cursor-pointer' : '')
      const iframe = document.createElement('iframe')
      if (editor.isEditable) {
        iframe.className = 'pointer-events-none'
      }
      iframe.width = '640'
      iframe.height = '360'
      iframe.allow =
        'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
      iframe.referrerPolicy = 'strict-origin-when-cross-origin'
      iframe.allowFullscreen = true
      iframe.src = node.attrs.src
      div.append(iframe)
      return {
        dom: div,
      }
    }
  },

  addCommands() {
    return {
      setHtml:
        (value) =>
        ({ commands, state }) => {
          let attributes: Record<string, any> = {
            editorValue: value,
          }

          if (value?.includes('youtube.com')) {
            const ytValue = value?.split('v=')?.[1]?.split('&')?.[0]
            attributes = {
              ...attributes,

              src: `https://www.youtube.com/embed/${ytValue}?controls=0`,
              title: 'YouTube video player',
            }
          } else if (value?.includes('instagram.com')) {
            const instagramValue = value?.split('p/')?.[1]?.split('/')?.[0]
            attributes = {
              ...attributes,

              src: `https://www.instagram.com/p/${instagramValue}/embed`,
              title: 'Instagram',
            }
          } else if (isValidHttpUrl(value)) {
            attributes = {
              ...attributes,

              src: value,
            }
          } else if (value?.includes('iframe')) {
            const parser = new DOMParser()
            const html = parser.parseFromString(value, 'text/html')
            const attrNames = html.getElementsByTagName('iframe')?.[0]?.getAttributeNames()

            attrNames?.forEach((attr) => {
              attributes[attr] = html.getElementsByTagName('iframe')?.[0]?.getAttribute(attr)
            })
          } else {
            const htmlData = 'data:text/html;charset=utf-8,' + encodeURI(value)
            attributes = {
              ...attributes,
              src: htmlData,
            }
          }

          return commands.insertContent({
            type: 'iframe',
            attrs: attributes,
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
