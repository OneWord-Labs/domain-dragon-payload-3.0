import React from "react";

import { PanelLeft, PanelLeftClose } from "lucide-react";
import { Icon } from "../../ui/Icon";
import { Toolbar } from "../../ui/Toolbar";
import { EditorUser } from "../types";
import { EditorInfo } from "./EditorInfo";

export type EditorHeaderProps = {
  isSidebarOpen?: boolean;
  toggleSidebar?: () => void;
  characters: number;
  words: number;
  users: EditorUser[];
};

export const EditorHeader = ({
  characters,
  users,
  words,
  isSidebarOpen,
  toggleSidebar,
}: EditorHeaderProps) => {
  return (
    <div className="w-full flex flex-row items-center justify-between flex-none py-2 pl-6 pr-3 text-black bg-white border-b border-neutral-200 dark:bg-black dark:text-white dark:border-neutral-800">
      <div className="flex flex-row gap-x-1.5 items-center">
        <div className="flex items-center gap-x-1.5">
          <Toolbar.Button
            type="button"
            tooltip={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
            onClick={toggleSidebar}
            active={isSidebarOpen}
            className={isSidebarOpen ? "bg-transparent" : ""}
          >
            <Icon icon={isSidebarOpen ? PanelLeftClose : PanelLeft} />
          </Toolbar.Button>
        </div>
      </div>
      <EditorInfo characters={characters} words={words} users={users} />
    </div>
  );
};
