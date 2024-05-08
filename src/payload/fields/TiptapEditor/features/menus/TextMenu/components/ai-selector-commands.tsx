import React from 'react'

import {
  ArrowDownWideNarrow,
  ArrowRight,
  CheckCheck,
  ChevronDown,
  Languages,
  RefreshCcwDot,
  StepForward,
  WrapText,
} from 'lucide-react'
import { useAssistant } from 'ai/react'
import { Toolbar } from '../../../ui/Toolbar'
import { getPrevText } from '@/payload/fields/TiptapEditor/lib/utils'
import { Editor } from '@tiptap/react'
import { DropdownCategoryTitle } from '../../../ui/Dropdown'
import * as Popover from '@radix-ui/react-popover'
import { Icon } from '../../../ui/Icon'
import { Surface } from '../../../ui/Surface'
import { languages } from '@/payload/fields/TiptapEditor/lib/constants'
const options = [
  // {
  //   value: 'translate',
  //   label: 'Translate text',
  //   icon: WrapText,
  // },
  {
    value: 'summarize',
    label: 'Summarize text',
    icon: WrapText,
  },
  {
    value: 'rewrite',
    label: 'Rewrite into Axios',
    icon: WrapText,
  },
  {
    value: 'improve',
    label: 'Improve writing',
    icon: RefreshCcwDot,
  },

  {
    value: 'fix',
    label: 'Fix grammar',
    icon: CheckCheck,
  },
  {
    value: 'shorter',
    label: 'Make shorter',
    icon: ArrowDownWideNarrow,
  },
  {
    value: 'longer',
    label: 'Make longer',
    icon: WrapText,
  },
]

interface AISelectorCommandsProps {
  editor: Editor
  onSelect: (value: string, options: { option: string; language?: string }) => void
}

const AISelectorCommands = ({ onSelect, editor }: AISelectorCommandsProps) => {
  const { status, messages, input, submitMessage, handleInputChange } = useAssistant({
    api: '/api/assistant',
  })

  return (
    <>
      <DropdownCategoryTitle>Edit or review selection</DropdownCategoryTitle>
      <Popover.Root>
        <Popover.Trigger asChild>
          <Toolbar.Button
            className="gap-2 px-4 w-full flex justify-start "
            type="button"
            // active={!!states.currentHighlight}
            tooltip="Highlight text"
          >
            <Icon icon={Languages} className="h-4 w-4 text-blue-500" />
            Translate text
            <Icon icon={ChevronDown} className="h-4 w-4 text-blue-500" />
          </Toolbar.Button>
        </Popover.Trigger>
        <Popover.Content side="right" align="start" sideOffset={8} asChild>
          <Surface className="flex flex-col min-w-[15rem] p-2 max-h-[20rem] overflow-auto">
            <DropdownCategoryTitle>Languages</DropdownCategoryTitle>

            {languages.map((lang) => (
              <Toolbar.Button
                onClick={() => {
                  const { from, to, empty } = editor.state.selection
                  const content = editor.state.doc.textBetween(from, to, ' ')
                  onSelect(content, { option: 'translate', language: lang.value })
                }}
                className="gap-2 px-4 w-full flex justify-start "
                key={lang.value}
              >
                {lang.label}
              </Toolbar.Button>
            ))}
          </Surface>
        </Popover.Content>
      </Popover.Root>

      {options.map((option) => (
        <Toolbar.Button
          // onSelect={(value) => {
          //   const slice = editor.state.selection.content()
          //   const text = editor.storage.markdown.serializer.serialize(slice.content)
          //   onSelect(text, option.value)
          // }}
          onClick={() => {
            const { from, to, empty } = editor.state.selection
            const content = editor.state.doc.textBetween(from, to, ' ')
            onSelect(content, { option: option.value })
          }}
          className=" gap-2 px-4 w-full flex justify-start"
          key={option.value}
          value={option.value}
        >
          <option.icon className="h-4 w-4 text-blue-500" />
          {option.label}
        </Toolbar.Button>
      ))}
      <Toolbar.Divider horizontal />
      <DropdownCategoryTitle>Use AI to do more</DropdownCategoryTitle>
      <Toolbar.Button
        onClick={() => {
          const text = getPrevText(editor, { chars: 5000 })
          onSelect(text, { option: 'continue' })
        }}
        value="continue"
        className="gap-2 px-4 w-full flex justify-start"
      >
        <StepForward className="h-4 w-4 text-blue-500" />
        Continue writing
      </Toolbar.Button>
    </>
  )
}

export default AISelectorCommands
