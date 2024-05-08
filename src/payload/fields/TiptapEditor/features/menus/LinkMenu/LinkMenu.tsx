import { BubbleMenu as BaseBubbleMenu, Editor } from '@tiptap/react'
import React, { useCallback, useState } from 'react'

import { MenuProps } from '../types'
import { LinkEditorPanel, LinkPreviewPanel } from '../../panels'
import { supportedSocialMedia } from '@/payload/fields/TiptapEditor/extensions/SocialMedia/menus/constants'
import { Surface } from '../../ui/Surface'
import { Toolbar } from '../../ui/Toolbar'
import { Instagram, Twitter, Youtube } from 'lucide-react'

export const LinkMenu = ({ editor, appendTo }: MenuProps): JSX.Element => {
  const [showEdit, setShowEdit] = useState(false)

  const shouldShow = useCallback(() => {
    const isActive = editor.isActive('link')
    return isActive
  }, [editor])

  const shouldShowSocialMedia = useCallback(() => {
    const { href: link, target } = editor.getAttributes('link')
    const isActive = editor.isActive('link')
    return isActive && checkIfMatchesSocialMedia(link)
  }, [editor])

  const { href: link, target } = editor.getAttributes('link')

  const handleEdit = useCallback(() => {
    setShowEdit(true)
  }, [])

  const onSetLink = useCallback(
    (url: string, openInNewTab?: boolean) => {
      editor
        .chain()
        .focus()
        .extendMarkRange('link')
        .setLink({ href: url, target: openInNewTab ? '_blank' : '' })
        .run()
      setShowEdit(false)
    },
    [editor],
  )

  const onUnsetLink = useCallback(() => {
    editor.chain().focus().extendMarkRange('link').unsetLink().run()
    setShowEdit(false)
    return null
  }, [editor])

  const onShowEdit = useCallback(() => {
    setShowEdit(true)
  }, [])

  const onHideEdit = useCallback(() => {
    setShowEdit(false)
  }, [])

  return (
    <>
      <BaseBubbleMenu
        editor={editor}
        pluginKey="textMenu"
        shouldShow={shouldShow}
        updateDelay={0}
        tippyOptions={{
          popperOptions: {
            modifiers: [{ name: 'flip', enabled: false }],
          },
          appendTo: () => {
            return appendTo?.current
          },
          onHidden: () => {
            setShowEdit(false)
          },
        }}
      >
        {showEdit ? (
          <LinkEditorPanel
            initialUrl={link}
            initialOpenInNewTab={target === '_blank'}
            onSetLink={onSetLink}
          />
        ) : (
          <LinkPreviewPanel url={link} onClear={onUnsetLink} onEdit={handleEdit} />
        )}
      </BaseBubbleMenu>
      <BaseBubbleMenu
        editor={editor}
        pluginKey="socialMediaTextMenu"
        shouldShow={shouldShowSocialMedia}
        updateDelay={0}
        tippyOptions={{
          popperOptions: {
            placement: 'bottom-start',
          },
          placement: 'bottom-start',
          appendTo: () => {
            return appendTo?.current
          },
          onHidden: () => {
            setShowEdit(false)
          },
        }}
      >
        <Surface className="p-2 min-w-[20rem]">{checkIfMatch(link, editor)}</Surface>
      </BaseBubbleMenu>
    </>
  )
}

export default LinkMenu

const checkIfMatch = (url: string, editor: Editor) => {
  const twitterRegex = /^https:\/\/twitter\.com\/([a-zA-Z0-9_-]+)\/status\/(\d+)/g
  const instagramRegex = /^https:\/\/www\.instagram\.com\/p\/([A-Za-z0-9_-]+)/g
  const youtubeRegex =
    /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube(-nocookie)?\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|live\/|v\/)?)([\w\-]+)(\S+)?/g

  if (twitterRegex.test(url)) {
    return (
      <Toolbar.Button
        onClick={() => {
          editor.chain().selectParentNode().deleteSelection().insertTwitter(url).run()
        }}
        value="continue"
        className="gap-2 px-4 w-full flex justify-start"
      >
        <Twitter />
        Embed Tweet
      </Toolbar.Button>
    )
  } else if (instagramRegex.test(url)) {
    return (
      <Toolbar.Button
        onClick={() => {
          editor.chain().selectParentNode().deleteSelection().insertInstagram(url).run()
        }}
        value="continue"
        className="gap-2 px-4 w-full flex justify-start"
      >
        <Instagram />
        Embed Instagram
      </Toolbar.Button>
    )
  } else if (youtubeRegex.test(url)) {
    return (
      <Toolbar.Button
        onClick={() => {
          editor.chain().selectParentNode().deleteSelection().insertYoutube(url).run()
        }}
        value="continue"
        className="gap-2 px-4 w-full flex justify-start"
      >
        <Youtube />
        Embed Youtube
      </Toolbar.Button>
    )
  }
  return null
}

const checkIfMatchesSocialMedia = (url: string) => {
  const twitterRegex = /^https:\/\/twitter\.com\/([a-zA-Z0-9_-]+)\/status\/(\d+)/g
  const instagramRegex = /^https:\/\/www\.instagram\.com\/p\/([A-Za-z0-9_-]+)/g
  const youtubeRegex =
    /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube(-nocookie)?\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|live\/|v\/)?)([\w\-]+)(\S+)?/g

  if (twitterRegex.test(url)) {
    return true
  } else if (instagramRegex.test(url)) {
    return true
  } else if (youtubeRegex.test(url)) {
    return true
  }
  return false
}
