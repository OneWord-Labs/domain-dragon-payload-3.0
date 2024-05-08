import { NodeViewContent, NodeViewWrapper } from '@tiptap/react'
import { Twitter } from 'lucide-react'
import { XEmbed } from 'react-social-media-embed'
import '../socialMedia.scss'
import SocialMediaEmbed from '../SocialMediaEmbed'

export default (props: { node: { attrs: { url?: string } } }) => {
  return (
    <SocialMediaEmbed props={props} Icon={Twitter} text={'Embed a Tweet from X'}>
      <XEmbed url={props?.node?.attrs?.url ?? ''} width={325} />
    </SocialMediaEmbed>
  )
}
