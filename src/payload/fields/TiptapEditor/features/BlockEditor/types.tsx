export interface TiptapProps {
  hasCollab: boolean
  handleChange: (value: any) => void
  content: { html: string; json: any; markdown: string }
}

export type LanguageOption = {
  name: string
  label: string
  value: any
}
export type EditorUser = {
  clientId: string
  name: string
  color: string
  initials?: string
}

export type AiTone =
  | 'academic'
  | 'business'
  | 'casual'
  | 'childfriendly'
  | 'conversational'
  | 'emotional'
  | 'humorous'
  | 'informative'
  | 'inspirational'
  | string

export type AiPromptType = 'SHORTEN' | 'EXTEND' | 'SIMPLIFY' | 'TONE'

export type AiToneOption = {
  name: string
  label: string
  value: AiTone
}

export type AiImageStyle = {
  name: string
  label: string
  value: string
}
