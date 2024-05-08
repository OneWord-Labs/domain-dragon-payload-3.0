import React from "react";
import { Icon } from "../../../ui/Icon";
import { Toolbar } from "../../../ui/Toolbar";
import * as Popover from "@radix-ui/react-popover";
import { LinkEditorPanel } from "../../../panels";
import { Link } from "lucide-react";
import { IframeLinkEditorPanel } from "../../../panels/IframeLinkEditorPanel";

export type EditIframeLinkPopoverProps = {
  onSetLink: (src: string) => void;
  initialSrcLink: string;
};

export const EditIframeLinkPopover = ({
  onSetLink,
  initialSrcLink,
}: EditIframeLinkPopoverProps) => {
  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <Toolbar.Button type="button" tooltip="Set Embed Code / Embed Link">
          <Icon icon={Link} />
        </Toolbar.Button>
      </Popover.Trigger>
      <Popover.Content>
        <IframeLinkEditorPanel
          onSetLink={onSetLink}
          initialSrc={initialSrcLink ?? ""}
        />
      </Popover.Content>
    </Popover.Root>
  );
};
