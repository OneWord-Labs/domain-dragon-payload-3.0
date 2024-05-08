import { Button } from '../../ui/Button'
import { Icon } from '../../ui/Icon'
import { Surface } from '../../ui/Surface'
import React, { useState, useCallback, useMemo } from 'react'
import { Toggle } from '../../ui/Toggle'
import { Link } from 'lucide-react'

export type SocialMediaEditorPanelProps = {
  initialSrc?: string
  initialOpenInNewTab?: boolean
  onSetLink: (src: string) => void
  placeholderText: string
  buttonText: string
  descriptionText: string
}

export const useLinkEditorState = ({ initialSrc, onSetLink }: SocialMediaEditorPanelProps) => {
  const [url, setUrl] = useState(initialSrc || '')

  const onChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(event.target.value)
  }, [])

  // const isValidUrl = useMemo(() => /^(\S+):(\/\/)?\S+$/.test(url), [url]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      // if (isValidUrl) {
      onSetLink(url)
      // }
    },
    [url, onSetLink],
  )

  return {
    url,
    setUrl,
    onChange,
    handleSubmit,
  }
}

export const SocialMediaEditorPanel = ({
  onSetLink,
  initialOpenInNewTab,
  initialSrc,
  placeholderText,
  buttonText,
  descriptionText,
}: SocialMediaEditorPanelProps) => {
  const state = useLinkEditorState({
    onSetLink,
    initialOpenInNewTab,
    initialSrc,
    placeholderText,
    buttonText,
    descriptionText,
  })

  return (
    <Surface className="p-2">
      <div className="flex flex-col items-center gap-2 p-1">
        <label className="flex items-center gap-2 p-2 rounded-lg bg-neutral-100 dark:bg-neutral-900 cursor-text w-full">
          {/* <Icon icon={Link} className="flex-none text-black dark:text-white" /> */}
          <input
            className="flex-1 bg-transparent outline-none min-w-[276px] text-black text-sm dark:text-white"
            placeholder={placeholderText}
            value={state.url}
            onChange={state.onChange}
          />
        </label>
        <Button
          variant="primary"
          buttonSize="medium"
          className="w-full m-2"
          type="button"
          onClick={(e) => {
            state.handleSubmit(e)
          }}
          // disabled={!state.isValidUrl}
        >
          {buttonText}
        </Button>
        <span className="mt-1 mb-0 text-sm">{descriptionText}</span>
      </div>
    </Surface>
  )
}
