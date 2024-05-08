import React from 'react'

import { Check, TextQuote, TrashIcon } from 'lucide-react'
import { Editor } from '@tiptap/react'
import { Toolbar } from '../../../ui/Toolbar'
import * as Popover from '@radix-ui/react-popover'
import { Icon } from '../../../ui/Icon'
import { Surface } from '../../../ui/Surface'

const AICompletionCommands = ({
  completion,
  onDiscard,
  editor,
}: {
  editor: Editor
  completion: string
  onDiscard: () => void
}) => {
  return (
    <>
      <Toolbar.Button
        className="gap-2 px-4 w-full flex justify-start "
        value="replace"
        onClick={() => {
          const selection = editor.view.state.selection

          editor
            .chain()
            .focus()
            .insertContentAt(
              {
                from: selection.from,
                to: selection.to,
              },
              completion,
            )
            .run()
        }}
      >
        <Check className="h-4 w-4 text-muted-foreground" />
        Replace selection
      </Toolbar.Button>
      <Toolbar.Button
        className="gap-2 px-4 w-full flex justify-start"
        value="insert"
        onClick={() => {
          const selection = editor.view.state.selection
          editor
            .chain()
            .focus()
            .insertContentAt(selection.to + 1, completion)
            .run()
        }}
      >
        <TextQuote className="h-4 w-4 text-muted-foreground" />
        Insert below
      </Toolbar.Button>
      <Toolbar.Divider horizontal />

      <Toolbar.Button
        onClick={onDiscard}
        value="thrash"
        className="w-full text-red-500 bg-red-500 dark:text-red-500 hover:bg-red-500 dark:hover:text-red-500 dark:hover:bg-red-500 bg-opacity-10 hover:bg-opacity-20 dark:hover:bg-opacity-20"
      >
        <TrashIcon className="h-4 w-4 text-muted-foreground" />
        Discard
      </Toolbar.Button>
    </>
  )
}

export default AICompletionCommands
