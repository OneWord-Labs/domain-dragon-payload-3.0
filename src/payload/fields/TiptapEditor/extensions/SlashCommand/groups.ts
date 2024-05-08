import {
  Book,
  Columns2,
  Facebook,
  Heading1,
  Heading2,
  Heading3,
  Image,
  Instagram,
  Link,
  Linkedin,
  List,
  ListOrdered,
  ListTodo,
  Minus,
  Music,
  Quote,
  SquareCode,
  Table,
  Twitch,
  Twitter,
  Youtube,
} from 'lucide-react'
import { Group } from './types'

export const GROUPS: Group[] = [
  {
    name: 'format',
    title: 'Format',
    commands: [
      {
        name: 'heading1',
        label: 'Heading 1',
        icon: Heading1,
        description: 'High priority section title',
        aliases: ['h1'],
        action: (editor) => {
          editor.chain().focus().setHeading({ level: 1 }).run()
        },
      },
      {
        name: 'heading2',
        label: 'Heading 2',
        icon: Heading2,
        description: 'Medium priority section title',
        aliases: ['h2'],
        action: (editor) => {
          editor.chain().focus().setHeading({ level: 2 }).run()
        },
      },
      {
        name: 'heading3',
        label: 'Heading 3',
        icon: Heading3,
        description: 'Low priority section title',
        aliases: ['h3'],
        action: (editor) => {
          editor.chain().focus().setHeading({ level: 3 }).run()
        },
      },
      {
        name: 'bulletList',
        label: 'Bullet List',
        icon: List,
        description: 'Unordered list of items',
        aliases: ['ul'],
        action: (editor) => {
          editor.chain().focus().toggleBulletList().run()
        },
      },
      {
        name: 'numberedList',
        label: 'Numbered List',
        icon: ListOrdered,
        description: 'Ordered list of items',
        aliases: ['ol'],
        action: (editor) => {
          editor.chain().focus().toggleOrderedList().run()
        },
      },
      {
        name: 'taskList',
        label: 'Task List',
        icon: ListTodo,
        description: 'Task list with todo items',
        aliases: ['todo'],
        action: (editor) => {
          editor.chain().focus().toggleTaskList().run()
        },
      },
      {
        name: 'blockquote',
        label: 'Blockquote',
        icon: Quote,
        description: 'Element for quoting',
        action: (editor) => {
          editor.chain().focus().setBlockquote().run()
        },
      },
      {
        name: 'codeBlock',
        label: 'Code Block',
        icon: SquareCode,
        description: 'Code block with syntax highlighting',
        shouldBeHidden: (editor) => editor.isActive('columns'),
        action: (editor) => {
          editor.chain().focus().setCodeBlock().run()
        },
      },
    ],
  },
  {
    name: 'insert',
    title: 'Insert',
    commands: [
      {
        name: 'table',
        label: 'Table',
        icon: Table,
        description: 'Insert a table',
        shouldBeHidden: (editor) => editor.isActive('columns'),
        action: (editor) => {
          editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: false }).run()
        },
      },
      {
        name: 'image',
        label: 'Image',
        icon: Image,
        description: 'Insert an image',
        aliases: ['img'],
        action: (editor) => {
          editor.chain().focus().setImageUpload().run()
        },
      },
      {
        name: 'columns',
        label: 'Columns',
        icon: Columns2,
        description: 'Add two column content',
        aliases: ['cols'],
        shouldBeHidden: (editor) => editor.isActive('columns'),
        action: (editor) => {
          editor
            .chain()
            .focus()
            .setColumns()
            .focus(editor.state.selection.head - 1)
            .run()
        },
      },
      {
        name: 'horizontalRule',
        label: 'Horizontal Rule',
        icon: Minus,
        description: 'Insert a horizontal divider',
        aliases: ['hr'],
        action: (editor) => {
          editor.chain().focus().setHorizontalRule().run()
        },
      },
      {
        name: 'toc',
        label: 'Table of Contents',
        icon: Book,
        aliases: ['outline'],
        description: 'Insert a table of contents',
        shouldBeHidden: (editor) => editor.isActive('columns'),
        action: (editor) => {
          editor.chain().focus().insertTableOfContents().run()
        },
      },
    ],
  },
  {
    name: 'embed',
    title: 'Embed',
    commands: [
      {
        name: 'iframe',
        label: 'IFrame',
        icon: Link,
        aliases: ['iframe'],
        description: 'Insert a iframe',
        shouldBeHidden: (editor) => editor.isActive('iframe'),
        action: (editor) => {
          editor.chain().focus().setHtml('<div>Embed your content here</div>').run()
        },
      },
      {
        name: 'twitter',
        label: 'Twitter Embed',
        icon: Twitter,
        aliases: ['x', 'twitter'],
        description: 'Insert a Twitter embed',
        shouldBeHidden: (editor) => editor.isActive('twitter'),
        action: (editor) => {
          editor.chain().focus().insertTwitter().run()
        },
      },
      // {
      //   name: 'facebook',
      //   label: 'Facebook Embed',
      //   icon: Facebook,
      //   aliases: ['meta', 'facebook'],
      //   description: 'Insert a Facebook embed',
      //   shouldBeHidden: (editor) => editor.isActive('facebook'),
      //   action: (editor) => {
      //     editor.chain().focus().insertFacebook().run()
      //   },
      // },
      {
        name: 'instagram',
        label: 'Instagram Embed',
        icon: Instagram,
        aliases: ['instagram'],
        description: 'Insert a Instagram embed',
        shouldBeHidden: (editor) => editor.isActive('instagram'),
        action: (editor) => {
          editor.chain().focus().insertInstagram().run()
        },
      },
      {
        name: 'youtube',
        label: 'Youtube Embed',
        icon: Youtube,
        aliases: ['youtube'],
        description: 'Insert a Youtube embed',
        shouldBeHidden: (editor) => editor.isActive('youtube'),
        action: (editor) => {
          editor.chain().focus().insertYoutube().run()
        },
      },
      // {
      //   name: 'linkedin',
      //   label: 'Linkedin Embed',
      //   icon: Linkedin,
      //   aliases: ['linkedin'],
      //   description: 'Insert a Linkedin embed',
      //   shouldBeHidden: (editor) => editor.isActive('linkedin'),
      //   action: (editor) => {

      //     editor.chain().focus().insertLinkedin().run()
      //   },
      // },

      // {
      //   name: 'tiktok',
      //   label: 'Tiktok Embed',
      //   icon: Music,
      //   aliases: ['tiktok'],
      //   description: 'Insert a Tiktok embed',
      //   shouldBeHidden: (editor) => editor.isActive('tiktok'),
      //   action: (editor) => {
      //     editor.chain().focus().insertTiktok().run()
      //   },
      // },
    ],
  },
]

export default GROUPS
