import React from 'react'
import { Icon } from '../../../ui/Icon'
import { Toolbar } from '../../../ui/Toolbar'
import * as Popover from '@radix-ui/react-popover'
import { LinkEditorPanel } from '../../../panels'
import { Link } from 'lucide-react'

export type EditLinkPopoverProps = {
  onSetLink: (link: string, openInNewTab?: boolean) => void
}

export const EditLinkPopover = ({ onSetLink }: EditLinkPopoverProps) => {
  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <Toolbar.Button type="button" tooltip="Set Link">
          <Icon icon={Link} />
        </Toolbar.Button>
      </Popover.Trigger>
      <Popover.Content>
        <LinkEditorPanel onSetLink={onSetLink} />
      </Popover.Content>
    </Popover.Root>
  )
}
