import { NodeViewContent, NodeViewWrapper } from '@tiptap/react'
import React from 'react'
import { LinkedInEmbed } from 'react-social-media-embed'
import { Linkedin } from 'lucide-react'
import '../socialMedia.scss'
import SocialMediaEmbed from '../SocialMediaEmbed'

export default (props: { node: { attrs: { url?: string } } }) => {
  return (
    <SocialMediaEmbed props={props} Icon={Linkedin} text={'Embed a post from Linkedin'}>
      <LinkedInEmbed
        url="https://www.linkedin.com/embed/feed/update/urn:li:share:6898694772484112384"
        postUrl="https://www.linkedin.com/posts/peterdiamandis_5-discoveries-the-james-webb-telescope-will-activity-6898694773406875648-z-D7"
        width={325}
        height={570}
      />
    </SocialMediaEmbed>
  )
}
