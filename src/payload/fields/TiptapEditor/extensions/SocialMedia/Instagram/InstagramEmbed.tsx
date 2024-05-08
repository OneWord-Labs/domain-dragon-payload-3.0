import { Instagram } from 'lucide-react'
import { InstagramEmbed } from 'react-social-media-embed'
import SocialMediaEmbed from '../SocialMediaEmbed'
import '../socialMedia.scss'

export default (props: { node: { attrs: { url?: string } } }) => {
  return (
    <SocialMediaEmbed props={props} Icon={Instagram} text={'Embed a post from Instagram'}>
      <InstagramEmbed
        className="max-w-[328px]"
        url={props?.node?.attrs?.url ?? ''}
        width={328}
        captioned
      />
    </SocialMediaEmbed>
  )
}
