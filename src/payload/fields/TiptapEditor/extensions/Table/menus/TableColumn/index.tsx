import { BubbleMenu as BaseBubbleMenu } from '@tiptap/react'
import React, { ReactNode, useCallback } from 'react'

import { ArrowLeftToLine, ArrowRightToLine, Trash } from 'lucide-react'
import { MenuProps, ShouldShowProps } from '../../../../features/menus/types'
import { Icon } from '../../../../features/ui/Icon'
import * as PopoverMenu from '../../../../features/ui/PopoverMenu'
import { Toolbar } from '../../../../features/ui/Toolbar'
import { isColumnGripSelected } from './utils'

export const TableColumnMenu = React.memo(({ editor, appendTo }: MenuProps): ReactNode => {
  const shouldShow = useCallback(
    ({ view, state, from }: ShouldShowProps) => {
      if (!state) {
        return false
      }

      return isColumnGripSelected({ editor, view, state, from: from || 0 })
    },
    [editor],
  )

  const onAddColumnBefore = useCallback(() => {
    editor.chain().focus().addColumnBefore().run()
  }, [editor])

  const onAddColumnAfter = useCallback(() => {
    editor.chain().focus().addColumnAfter().run()
  }, [editor])

  const onDeleteColumn = useCallback(() => {
    editor.chain().focus().deleteColumn().run()
  }, [editor])

  return (
    <BaseBubbleMenu
      editor={editor}
      pluginKey="tableColumnMenu"
      updateDelay={0}
      tippyOptions={{
        appendTo: () => {
          return appendTo?.current
        },
        offset: [0, 15],
        popperOptions: {
          modifiers: [{ name: 'flip', enabled: false }],
        },
      }}
      shouldShow={shouldShow}
    >
      <Toolbar.Wrapper isVertical>
        <PopoverMenu.Item
          iconComponent={<Icon icon={ArrowLeftToLine} />}
          close={false}
          label="Add column before"
          onClick={onAddColumnBefore}
        />
        <PopoverMenu.Item
          iconComponent={<Icon icon={ArrowRightToLine} />}
          close={false}
          label="Add column after"
          onClick={onAddColumnAfter}
        />
        <PopoverMenu.Item
          icon={Trash}
          close={false}
          label="Delete column"
          onClick={onDeleteColumn}
        />
      </Toolbar.Wrapper>
    </BaseBubbleMenu>
  )
})

TableColumnMenu.displayName = 'TableColumnMenu'

export default TableColumnMenu
