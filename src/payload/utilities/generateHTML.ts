import { createHeadlessEditor } from '@lexical/headless' // <= make sure this package is installed
import { $convertFromMarkdownString, TRANSFORMERS } from '@lexical/markdown'
import {
  defaultEditorConfig,
  defaultEditorFeatures,
  getEnabledNodes,
  sanitizeServerEditorConfig,
} from '@payloadcms/richtext-lexical'
import {
  BlocksFeature,
  FixedToolbarFeature,
  HeadingFeature,
  HorizontalRuleFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import { Banner } from '@/payload/blocks/Banner'
import { Code } from '@/payload/blocks/Code'
import { MediaBlock } from '@/payload/blocks/MediaBlock'
import payloadConfig from '@/payload.config'
const yourEditorConfig = defaultEditorConfig

// If you made changes to the features of the field's editor config, you should also make those changes here:
yourEditorConfig.features = [
  ...defaultEditorFeatures,
  HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
  HorizontalRuleFeature(),
  // Add your custom features here
] as any[]
export const generateContent = async (markdown: string): Promise<any> => {
  const yourSanitizedEditorConfig = await sanitizeServerEditorConfig(
    yourEditorConfig,
    await payloadConfig,
  ) // <= your editor config here
  const headlessEditor = createHeadlessEditor({
    nodes: getEnabledNodes({
      editorConfig: yourSanitizedEditorConfig,
    }),
  })

  headlessEditor.update(
    () => {
      $convertFromMarkdownString(markdown, yourSanitizedEditorConfig.features.markdownTransformers)
    },
    { discrete: true },
  )

  // Do this if you then want to get the editor JSON
  const editorJSON = headlessEditor.getEditorState().toJSON() as any

  return editorJSON
}
