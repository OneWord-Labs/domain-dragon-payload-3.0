'use client'

import { getPrevText } from '@/payload/fields/TiptapEditor/lib/utils'
import { Editor } from '@tiptap/react'
import { useCompletion } from 'ai/react'
import { ArrowRight, Sparkles } from 'lucide-react'
import { useState } from 'react'
import Markdown from 'react-markdown'
import { toast } from 'react-toastify'
import AICompletionCommands from '../../menus/TextMenu/components/ai-completion-command'
import AISelectorCommands from '../../menus/TextMenu/components/ai-selector-commands'
import { Surface } from '../../ui/Surface'
import { Toolbar } from '../../ui/Toolbar'
import CrazySpinner from '../../ui/crazy-spinner'
import { ScrollArea } from '../../ui/scroll-area'
import { isRTL } from '@/lib/isRTL'
export type AIEditorPanelProps = {
  editor: Editor
  onOpenChange: (value: boolean) => void
}

export const AIEditorPanel = ({ editor, onOpenChange }: AIEditorPanelProps) => {
  const [inputValue, setInputValue] = useState('')

  // const { status, messages, input, submitMessage, handleInputChange } = useAssistant({
  //   // id: "novel",
  //   api: "/api/assistant",
  //   onResponse: (response) => {
  //     if (response.status === 429) {
  //       toast.error("You have reached your request limit for the day.");
  //       return;
  //     }
  //   },
  //   onError: (e) => {
  //     toast.error(e.message);
  //   },
  // });

  const { completion, complete, isLoading } = useCompletion({
    // id: "novel",
    api: '/api/generate',
    onResponse: (response) => {
      if (response.status === 429) {
        toast.error('You have reached your request limit for the day.')
        return
      }
    },
    onError: (e) => {
      toast.error(e.message)
    },
  })

  const hasCompletion = completion.length > 0
  const handleClick = () => {
    if (completion)
      return complete(completion, {
        body: { option: 'zap', command: inputValue },
      }).then(() => setInputValue(''))
    const text = getPrevText(editor, { chars: 5000 })

    complete(text, {
      body: { option: 'zap', command: inputValue },
    }).then(() => setInputValue(''))
  }
  return (
    <Surface className="p-2 min-w-[20rem]">
      <>
        {hasCompletion && (
          <div className="flex max-h-[400px]">
            <ScrollArea>
              <div className="prose p-2 px-4 prose-sm" dir={isRTL(completion) ? 'rtl' : 'ltr'}>
                <Markdown>{completion}</Markdown>
              </div>
            </ScrollArea>
          </div>
        )}

        {isLoading && (
          <div className="flex h-12 w-full items-center px-4 text-sm font-medium text-muted-foreground text-blue-500">
            <Sparkles className="mr-2 h-4 w-4 shrink-0  " />
            AI is thinking
            <div className="ml-2 mt-1">
              <CrazySpinner />
            </div>
          </div>
        )}

        {!isLoading && (
          <>
            <div className="flex justify-between items-center">
              {/* <CommandInput
                value={inputValue}
                onValueChange={setInputValue}
                autoFocus
                placeholder={
                  hasCompletion ? 'Tell AI what to do next' : 'Ask AI to edit or generate...'
                }
                // onFocus={() => addAIHighlight(editor)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleClick()
                }}
              /> */}
              <Sparkles className="mr-2 h-4 w-4 shrink-0 text-blue-500 " />
              <input
                className="w-full p-2 text-black bg-white  rounded dark:bg-black dark:text-white focus:outline-none"
                value={inputValue}
                onChange={(e) => {
                  setInputValue(e.target.value)
                }}
                placeholder={
                  hasCompletion ? 'Tell AI what to do next' : 'Ask AI to edit or generate...'
                }
                autoFocus
                // onFocus={() => addAIHighlight(editor)}

                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleClick()
                }}
              />
              <Toolbar.Button
                // size="icon"

                // className="absolute right-2 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full  bg-zinc-100 hover:bg-zinc-150"
                onClick={handleClick}
              >
                <ArrowRight />
              </Toolbar.Button>
            </div>
            {hasCompletion ? (
              <AICompletionCommands
                editor={editor}
                onDiscard={() => {
                  editor.chain().unsetHighlight().focus().run()
                  onOpenChange(false)
                }}
                completion={completion}
              />
            ) : (
              <AISelectorCommands
                editor={editor}
                onSelect={(value, options) => {
                  complete(value, { body: options })
                }}
              />
            )}
          </>
        )}
      </>
    </Surface>
  )
}
