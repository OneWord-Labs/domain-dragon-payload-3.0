import { BubbleMenu as BaseBubbleMenu } from '@tiptap/react'
import { useCallback } from 'react'

import { SocialMediaEditorPanel } from '@/payload/fields/TiptapEditor/features/panels/SocialMediaEditorPanel'
import { MenuProps } from '../../../features/menus/types'
import { supportedSocialMedia } from './constants'

export const SocialMediaMenu = ({ editor, appendTo }: MenuProps) => {
  const shouldShow = useCallback(() => {
    const isInSocialMedia = supportedSocialMedia?.some((socialMedia) => {
      const hasUrl = editor?.getAttributes(socialMedia)?.url
      return !hasUrl && editor.isActive(socialMedia)
    })

    return isInSocialMedia
    // const isIframe = editor.isActive('iframe')
    // return isIframe
  }, [editor])

  const onHtml = useCallback(
    (url: string) => {
      const socialMedia = supportedSocialMedia?.find((socialMedia) => {
        return editor.isActive(socialMedia)
      })
      switch (socialMedia) {
        case 'facebook':
          editor.chain().focus().insertFacebook(url).run()

          break
        case 'instagram':
          editor.chain().focus().insertInstagram(url).run()

          break
        case 'youtube':
          editor.chain().focus().insertYoutube(url).run()

          break
        case 'linkedin':
          editor.chain().focus().insertLinkedin(url).run()

          break
        case 'tiktok':
          editor.chain().focus().insertTiktok(url).run()

          break
        case 'twitter':
          editor.chain().focus().insertTwitter(url).run()
          break
      }
    },
    [editor],
  )

  const generateTexts = useCallback(() => {
    const socialMedia = supportedSocialMedia?.find((socialMedia) => {
      return editor.isActive(socialMedia)
    })
    switch (socialMedia) {
      case 'facebook':
        return {
          placeholderText: 'https://facebook.com/...',
          buttonText: 'Embed Facebook',
          descriptionText: 'Works with links to Facebook posts',
        }

      case 'instagram':
        return {
          placeholderText: 'https://instagram.com/...',
          buttonText: 'Embed Instagram',
          descriptionText: 'Works with links to Instagram posts',
        }
      case 'youtube':
        return {
          placeholderText: 'https://youtube.com/...',
          buttonText: 'Embed Youtube',
          descriptionText: 'Works with links to Youtube videos',
        }
      case 'linkedin':
        return {
          placeholderText: 'https://linkedin.com/...',
          buttonText: 'Embed Linkedin',
          descriptionText: 'Works with links to Linkedin posts',
        }
      case 'tiktok':
        return {
          placeholderText: 'https://tiktok.com/...',
          buttonText: 'Embed Tiktok',
          descriptionText: 'Works with links to tiktok videos',
        }
      case 'twitter':
        return {
          placeholderText: 'https://twitter.com/...',
          buttonText: 'Embed Twitter',
          descriptionText: 'Works with links to Tweets',
        }
    }
  }, [editor])
  return (
    <BaseBubbleMenu
      editor={editor}
      pluginKey={`socialMediaMenu`}
      shouldShow={shouldShow}
      tippyOptions={{
        popperOptions: { placement: 'bottom' },
        placement: 'bottom',
        // appendTo: () => {
        //   return appendTo?.current
        // },
      }}
      updateDelay={100}
    >
      <SocialMediaEditorPanel
        onSetLink={onHtml}
        initialSrc=""
        placeholderText={generateTexts()?.placeholderText ?? ''}
        buttonText={generateTexts()?.buttonText ?? ''}
        descriptionText={generateTexts()?.descriptionText ?? ''}
      />
      {/* <SocialMediaPopover onSetLink={onHtml} initialSrcLink={''} /> */}
      {/* 
      <Toolbar.Wrapper>
        <to
        <Toolbar.Button
          type="button"
          tooltip="Sidebar left"
          active={true}
          // onClick={onColumnLeft}
        >
          <SocialMediaPopover onSetLink={onHtml} initialSrcLink={''} />
        </Toolbar.Button>
      </Toolbar.Wrapper> */}
    </BaseBubbleMenu>
  )
}

export default SocialMediaMenu
