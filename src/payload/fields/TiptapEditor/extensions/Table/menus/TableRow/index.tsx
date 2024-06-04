import { BubbleMenu as BaseBubbleMenu } from '@tiptap/react'
import React, { ReactNode, useCallback } from 'react'
import * as PopoverMenu from '../../../../features/ui/PopoverMenu'

import { Toolbar } from '../../../../features/ui/Toolbar'

import { ArrowDownToLine, ArrowUpToLine, Trash } from 'lucide-react'
import { MenuProps, ShouldShowProps } from '../../../../features/menus/types'
import { Icon } from '../../../../features/ui/Icon'
import { isRowGripSelected } from './utils'

export const TableRowMenu = React.memo(({ editor, appendTo }: MenuProps): ReactNode => {
  const shouldShow = useCallback(
    ({ view, state, from }: ShouldShowProps) => {
      if (!state || !from) {
        return false
      }

      return isRowGripSelected({ editor, view, state, from })
    },
    [editor],
  )

  const onAddRowBefore = useCallback(() => {
    editor.chain().focus().addRowBefore().run()
  }, [editor])

  const onAddRowAfter = useCallback(() => {
    editor.chain().focus().addRowAfter().run()
  }, [editor])

  const onDeleteRow = useCallback(() => {
    editor.chain().focus().deleteRow().run()
  }, [editor])

  return (
    <BaseBubbleMenu
      editor={editor}
      pluginKey="tableRowMenu"
      updateDelay={0}
      tippyOptions={{
        appendTo: () => {
          return appendTo?.current
        },
        placement: 'left',
        offset: [0, 15],
        popperOptions: {
          modifiers: [{ name: 'flip', enabled: false }],
        },
      }}
      shouldShow={shouldShow}
    >
      <Toolbar.Wrapper isVertical>
        <PopoverMenu.Item
          iconComponent={<Icon icon={ArrowUpToLine} />}
          close={false}
          label="Add row before"
          onClick={onAddRowBefore}
        />
        <PopoverMenu.Item
          iconComponent={<Icon icon={ArrowDownToLine} />}
          close={false}
          label="Add row after"
          onClick={onAddRowAfter}
        />
        <PopoverMenu.Item icon={Trash} close={false} label="Delete row" onClick={onDeleteRow} />
      </Toolbar.Wrapper>
    </BaseBubbleMenu>
  )
})

TableRowMenu.displayName = 'TableRowMenu'

export default TableRowMenu
