import { Button } from "../../ui/Button";
import { Icon } from "../../ui/Icon";
import { Surface } from "../../ui/Surface";
import React, { useState, useCallback, useMemo } from "react";
import { Toggle } from "../../ui/Toggle";
import { Link } from "lucide-react";

export type IframeLinkEditorPanelProps = {
  initialSrc?: string;
  initialOpenInNewTab?: boolean;
  onSetLink: (src: string) => void;
};

export const useLinkEditorState = ({
  initialSrc,
  onSetLink,
}: IframeLinkEditorPanelProps) => {
  const [url, setUrl] = useState(initialSrc || "");

  const onChange = useCallback(
    (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      setUrl(event.target.value);
    },
    []
  );

  // const isValidUrl = useMemo(() => /^(\S+):(\/\/)?\S+$/.test(url), [url]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      // if (isValidUrl) {
      onSetLink(url);
      // }
    },
    [url, onSetLink]
  );

  return {
    url,
    setUrl,
    onChange,
    handleSubmit,
  };
};

export const IframeLinkEditorPanel = ({
  onSetLink,
  initialOpenInNewTab,
  initialSrc,
}: IframeLinkEditorPanelProps) => {
  const state = useLinkEditorState({
    onSetLink,
    initialOpenInNewTab,
    initialSrc,
  });

  return (
    <Surface className="p-2">
      <div className="flex items-center gap-2">
        <label className="flex items-center gap-2 p-2 rounded-lg bg-neutral-100 dark:bg-neutral-900 cursor-text">
          <Icon icon={Link} className="flex-none text-black dark:text-white" />
          <textarea
            className="flex-1 bg-transparent outline-none min-w-[12rem] text-black text-sm dark:text-white"
            placeholder="Enter Embed Code"
            value={state.url}
            onChange={state.onChange}
          />
        </label>
        <Button
          variant="primary"
          buttonSize="small"
          type="button"
          onClick={(e) => {
            state.handleSubmit(e);
          }}
          // disabled={!state.isValidUrl}
        >
          Set Link
        </Button>
      </div>
    </Surface>
  );
};
