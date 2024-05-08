import { NodeViewContent, NodeViewWrapper } from '@tiptap/react'
import { Facebook } from 'lucide-react'
import { FacebookEmbed } from 'react-social-media-embed'
import '../socialMedia.scss'
import SocialMediaEmbed from '../SocialMediaEmbed'

export default (props: { node: { attrs: { url?: string } } }) => {
  return (
    <SocialMediaEmbed props={props} Icon={Facebook} text={' Embed a post from Facebook'}>
      <FacebookEmbed url={props?.node?.attrs?.url ?? ''} width={550} />
    </SocialMediaEmbed>
  )
}
