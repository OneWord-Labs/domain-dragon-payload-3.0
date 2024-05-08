import { Field, JSONField } from 'payload/types'
import deepMerge from './lib/utils/deepMerge'
import { PartialRequired } from './lib/utils/partialRequired'
import { EditorComponent } from './Components'

type TextEditor = (
  /**
   * Field overrides
   */
  overrides: PartialRequired<JSONField, 'name'>,
) => Field[]

export const TipTapEditor: TextEditor = (overrides) => {
  const editorField = deepMerge<JSONField, Partial<JSONField>>(
    {
      name: 'editor',
      type: 'json',
      defaultValue: {},
      admin: {
        components: {
          Field: EditorComponent,
        },
      },
    },
    overrides,
  )

  const fields = [editorField]
  return fields
}
