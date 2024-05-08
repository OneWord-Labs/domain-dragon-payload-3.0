import { Youtube } from 'lucide-react'
import { YouTubeEmbed } from 'react-social-media-embed'
import SocialMediaEmbed from '../SocialMediaEmbed'
import '../socialMedia.scss'

export default (props: { node: { attrs: { url?: string } } }) => {
  return (
    <SocialMediaEmbed props={props} Icon={Youtube} text={'Embed a Youtube Video'}>
      <YouTubeEmbed url={props?.node?.attrs?.url ?? ''} />
    </SocialMediaEmbed>
  )
}
