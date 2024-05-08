import { useMemo } from 'react'

import { Editor, useEditor } from '@tiptap/react'

import ExtensionKit from '../extensions/extension-kit'
import { EditorUser } from '../features/BlockEditor/types'
import { useSidebar } from './useSidebar'
import TurndownService from 'turndown'

declare global {
  interface Window {
    editor: Editor | null
  }
}

export const useBlockEditor = ({
  content,
  handleChange,
}: {
  content: { html: string; json: any }
  handleChange: (data: any) => void
}) => {
  const leftSidebar = useSidebar()
  const turndownService = new TurndownService()

  const editor = useEditor(
    {
      content: content ?? {},
      autofocus: true,
      onCreate: ({ editor }) => {
        // provider?.on('synced', () => {
        //   if (editor.isEmpty) {
        //     editor.commands.setContent(initialContent)
        //   }
        // })
      },
      extensions: [
        ...ExtensionKit({
          // provider,
        }),
        // Collaboration.configure({
        //   document: ydoc,
        // }),
        // CollaborationCursor.configure({
        //   provider,
        //   user: {
        //     name: randomElement(userNames),
        //     color: randomElement(userColors),
        //   },
        // }),
      ],
      editorProps: {
        attributes: {
          autocomplete: 'off',
          autocorrect: 'off',
          autocapitalize: 'off',
          class: 'min-h-full',
        },
      },
      onUpdate: ({ editor }) => {
        handleChange({
          json: editor?.getJSON() ?? {},
          html: editor?.getHTML() ?? '',
          markdown: turndownService.turndown(editor?.getHTML() ?? ''),
        })
      },
    },
    [],
  )
  const users = useMemo(() => {
    if (!editor?.storage.collaborationCursor?.users) {
      return []
    }

    return editor.storage.collaborationCursor?.users.map((user: EditorUser) => {
      const names = user.name?.split(' ')
      const firstName = names?.[0]
      const lastName = names?.[names.length - 1]
      const initials = `${firstName?.[0] || '?'}${lastName?.[0] || '?'}`

      return { ...user, initials: initials.length ? initials : '?' }
    })
  }, [editor?.storage.collaborationCursor?.users])

  const characterCount = editor?.storage.characterCount || {
    characters: () => 0,
    words: () => 0,
  }

  // useEffect(() => {
  //   provider?.on('status', (event: { status: WebSocketStatus }) => {
  //     setCollabState(event.status)
  //   })
  // }, [provider])

  window.editor = editor

  return { editor, users, characterCount, leftSidebar }
}
