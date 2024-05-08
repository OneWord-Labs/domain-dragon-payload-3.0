import * as Popover from '@radix-ui/react-popover'
import { BubbleMenu, Editor } from '@tiptap/react'
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Bold,
  Code,
  FileCode,
  Highlighter,
  Italic,
  MoveVertical,
  Palette,
  Sparkles,
  Strikethrough,
  Subscript,
  Superscript,
  Underline,
} from 'lucide-react'
import { memo, useState } from 'react'
import { ColorPicker } from '../../panels'
import { AIEditorPanel } from '../../panels/AIEditorPanel'
import { Icon } from '../../ui/Icon'
import { Surface } from '../../ui/Surface'
import { Toolbar } from '../../ui/Toolbar'
import { ContentTypePicker } from './components/ContentTypePicker'
import { EditLinkPopover } from './components/EditLinkPopover'
import { FontFamilyPicker } from './components/FontFamilyPicker'
import { FontSizePicker } from './components/FontSizePicker'
import { useTextmenuCommands } from './hooks/useTextmenuCommands'
import { useTextmenuContentTypes } from './hooks/useTextmenuContentTypes'
import { useTextmenuStates } from './hooks/useTextmenuStates'

// We memorize the button so each button is not rerendered
// on every editor state change
const MemoButton = memo(Toolbar.Button)
const MemoColorPicker = memo(ColorPicker)
const MemoFontFamilyPicker = memo(FontFamilyPicker)
const MemoFontSizePicker = memo(FontSizePicker)
const MemoContentTypePicker = memo(ContentTypePicker)

export type TextMenuProps = {
  editor: Editor
}

export const TextMenu = ({ editor }: TextMenuProps) => {
  const commands = useTextmenuCommands(editor)
  const states = useTextmenuStates(editor)
  const blockOptions = useTextmenuContentTypes(editor)
  const [openAi, setOpenAi] = useState(false)

  return (
    <BubbleMenu
      tippyOptions={{
        placement: 'bottom',
        popperOptions: { placement: 'bottom' },
        onHide: () => {
          setOpenAi(false)
        },
      }}
      editor={editor}
      pluginKey="textMenu"
      shouldShow={states.shouldShow}
      updateDelay={100}
    >
      {openAi ? (
        <AIEditorPanel
          editor={editor}
          onOpenChange={(value) => {
            setOpenAi(value)
          }}
        />
      ) : (
        <Toolbar.Wrapper>
          <Toolbar.Button
            className="text-purple-500 hover:text-purple-600 active:text-purple-600 dark:text-purple-400 dark:hover:text-purple-300 dark:active:text-purple-400"
            activeClassname="text-purple-600 hover:text-purple-600 dark:text-purple-400 dark:hover:text-purple-200"
            onClick={() => setOpenAi(true)}
          >
            <Icon icon={Sparkles} className="mr-1" />
            AI Tools
          </Toolbar.Button>
          <Toolbar.Divider />

          <MemoContentTypePicker options={blockOptions} />
          <MemoFontFamilyPicker onChange={commands.onSetFont} value={states.currentFont || ''} />
          <MemoFontSizePicker onChange={commands.onSetFontSize} value={states.currentSize || ''} />
          <Toolbar.Divider />
          <MemoButton
            type="button"
            tooltip="Bold"
            tooltipShortcut={['Mod', 'B']}
            onClick={commands.onBold}
            active={states.isBold}
          >
            <Icon icon={Bold} />
          </MemoButton>
          <MemoButton
            type="button"
            tooltip="Italic"
            tooltipShortcut={['Mod', 'I']}
            onClick={commands.onItalic}
            active={states.isItalic}
          >
            <Icon icon={Italic} />
          </MemoButton>
          <MemoButton
            type="button"
            tooltip="Underline"
            tooltipShortcut={['Mod', 'U']}
            onClick={commands.onUnderline}
            active={states.isUnderline}
          >
            <Icon icon={Underline} />
          </MemoButton>
          <MemoButton
            type="button"
            tooltip="Strikehrough"
            tooltipShortcut={['Mod', 'Shift', 'S']}
            onClick={commands.onStrike}
            active={states.isStrike}
          >
            <Icon icon={Strikethrough} />
          </MemoButton>
          <MemoButton
            type="button"
            tooltip="Code"
            tooltipShortcut={['Mod', 'E']}
            onClick={commands.onCode}
            active={states.isCode}
          >
            <Icon icon={Code} />
          </MemoButton>
          <MemoButton type="button" tooltip="Code block" onClick={commands.onCodeBlock}>
            <Icon icon={FileCode} />
          </MemoButton>
          <EditLinkPopover onSetLink={commands.onLink} />
          <Popover.Root>
            <Popover.Trigger asChild>
              <MemoButton type="button" active={!!states.currentHighlight} tooltip="Highlight text">
                <Icon icon={Highlighter} />
              </MemoButton>
            </Popover.Trigger>
            <Popover.Content side="top" sideOffset={8} asChild>
              <Surface className="p-1">
                <MemoColorPicker
                  color={states.currentHighlight}
                  onChange={commands.onChangeHighlight}
                  onClear={commands.onClearHighlight}
                />
              </Surface>
            </Popover.Content>
          </Popover.Root>
          <Popover.Root>
            <Popover.Trigger asChild>
              <MemoButton type="button" active={!!states.currentColor} tooltip="Text color">
                <Icon icon={Palette} />
              </MemoButton>
            </Popover.Trigger>
            <Popover.Content side="top" sideOffset={8} asChild>
              <Surface className="p-1">
                <MemoColorPicker
                  color={states.currentColor}
                  onChange={commands.onChangeColor}
                  onClear={commands.onClearColor}
                />
              </Surface>
            </Popover.Content>
          </Popover.Root>
          <Popover.Root>
            <Popover.Trigger asChild>
              <MemoButton type="button" tooltip="More options">
                <Icon icon={MoveVertical} />
              </MemoButton>
            </Popover.Trigger>
            <Popover.Content side="top" asChild>
              <Toolbar.Wrapper>
                <MemoButton
                  type="button"
                  tooltip="Subscript"
                  tooltipShortcut={['Mod', '.']}
                  onClick={commands.onSubscript}
                  active={states.isSubscript}
                >
                  <Icon icon={Subscript} />
                </MemoButton>
                <MemoButton
                  type="button"
                  tooltip="Superscript"
                  tooltipShortcut={['Mod', ',']}
                  onClick={commands.onSuperscript}
                  active={states.isSuperscript}
                >
                  <Icon icon={Superscript} />
                </MemoButton>
                <Toolbar.Divider />
                <MemoButton
                  type="button"
                  tooltip="Align left"
                  tooltipShortcut={['Shift', 'Mod', 'L']}
                  onClick={commands.onAlignLeft}
                  active={states.isAlignLeft}
                >
                  <Icon icon={AlignLeft} />
                </MemoButton>
                <MemoButton
                  type="button"
                  tooltip="Align center"
                  tooltipShortcut={['Shift', 'Mod', 'E']}
                  onClick={commands.onAlignCenter}
                  active={states.isAlignCenter}
                >
                  <Icon icon={AlignCenter} />
                </MemoButton>
                <MemoButton
                  type="button"
                  tooltip="Align right"
                  tooltipShortcut={['Shift', 'Mod', 'R']}
                  onClick={commands.onAlignRight}
                  active={states.isAlignRight}
                >
                  <Icon icon={AlignRight} />
                </MemoButton>
                <MemoButton
                  type="button"
                  tooltip="Justify"
                  tooltipShortcut={['Shift', 'Mod', 'J']}
                  onClick={commands.onAlignJustify}
                  active={states.isAlignJustify}
                >
                  <Icon icon={AlignJustify} />
                </MemoButton>
              </Toolbar.Wrapper>
            </Popover.Content>
          </Popover.Root>
        </Toolbar.Wrapper>
      )}
    </BubbleMenu>
  )
}
