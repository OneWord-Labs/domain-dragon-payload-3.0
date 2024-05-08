import { NodeViewContent, NodeViewWrapper } from '@tiptap/react'
import { Music } from 'lucide-react'
import { TikTokEmbed } from 'react-social-media-embed'
import '../socialMedia.scss'
import SocialMediaEmbed from '../SocialMediaEmbed'

export default (props: { node: { attrs: { url?: string } } }) => {
  return (
    <SocialMediaEmbed props={props} Icon={Music} text={' Embed a Video from Tiktok'}>
      <TikTokEmbed url={props?.node?.attrs?.url ?? ''} />
    </SocialMediaEmbed>
  )
}
