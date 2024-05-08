import { BubbleMenu as BaseBubbleMenu } from "@tiptap/react";
import React, { useCallback } from "react";
import { sticky } from "tippy.js";
import { v4 as uuid } from "uuid";

import { EditIframeLinkPopover } from "../../../features/menus/TextMenu/components/EditIframeLinkPopover";
import { MenuProps } from "../../../features/menus/types";
import { Toolbar } from "../../../features/ui/Toolbar";
import { getRenderContainer } from "../../../lib/utils";

export const IframeMenu = ({ editor, appendTo }: MenuProps) => {
  const getReferenceClientRect = useCallback(() => {
    const renderContainer = getRenderContainer(editor, "iframe");
    const rect =
      renderContainer?.getBoundingClientRect() ||
      new DOMRect(-1000, -1000, 0, 0);

    return rect;
  }, [editor]);

  const shouldShow = useCallback(() => {
    const isIframe = editor.isActive("iframe");
    return isIframe;
  }, [editor]);

  const onHtml = useCallback(
    (html: string) => editor.chain().focus().setHtml(html).run(),
    [editor]
  );
  return (
    <BaseBubbleMenu
      editor={editor}
      pluginKey={`iframeMenu`}
      shouldShow={shouldShow}
      tippyOptions={{ popperOptions: { placement: "top-start" } }}
      updateDelay={100}
    >
      <Toolbar.Wrapper>
        <Toolbar.Button
          type="button"
          tooltip="Sidebar left"
          active={true}
          // onClick={onColumnLeft}
        >
          <EditIframeLinkPopover
            onSetLink={onHtml}
            initialSrcLink={editor?.getAttributes("iframe")?.editorValue ?? ""}
          />
        </Toolbar.Button>
      </Toolbar.Wrapper>
    </BaseBubbleMenu>
  );
};

export default IframeMenu;
