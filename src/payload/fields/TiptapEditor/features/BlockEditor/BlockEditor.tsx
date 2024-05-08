'use client'
import { EditorContent } from '@tiptap/react'
import React, { useMemo, useRef, useState } from 'react'

import { EditorContext } from '../../context/EditorContext'
import ImageBlockMenu from '../../extensions/ImageBlock/components/ImageBlockMenu'
import { ColumnsMenu } from '../../extensions/MultiColumn/menus'
import { TableColumnMenu, TableRowMenu } from '../../extensions/Table/menus'
import { useBlockEditor } from '../../hooks/useBlockEditor'
import { Sidebar } from '../Sidebar'
import { LinkMenu } from '../menus'
import { ContentItemMenu } from '../menus/ContentItemMenu'
import { TextMenu } from '../menus/TextMenu'
import { EditorHeader } from './components/EditorHeader'
import { TiptapProps } from './types'
import { IframeMenu } from '../../extensions/Iframe/menus'
import { SocialMediaMenu } from '../../extensions/SocialMedia/menus'

export const BlockEditor = ({ handleChange, content }: TiptapProps) => {
  const menuContainerRef = useRef(null)
  const editorRef = useRef<HTMLDivElement>(null)

  const { editor, users, characterCount, leftSidebar } = useBlockEditor({
    content: content?.json ?? {},
    handleChange: handleChange,
  })

  const displayedUsers = users.slice(0, 3)

  const providerValue = useMemo(() => {
    return {}
  }, [])

  if (!editor) {
    return null
  }

  return (
    <EditorContext.Provider value={providerValue}>
      <div className="flex h-full overflow-visible" ref={menuContainerRef}>
        <Sidebar isOpen={leftSidebar.isOpen} onClose={leftSidebar.close} editor={editor} />
        <div className="relative flex flex-col flex-1 h-full  justify-center items-center">
          <EditorHeader
            characters={characterCount.characters()}
            users={displayedUsers}
            words={characterCount.words()}
            isSidebarOpen={leftSidebar.isOpen}
            toggleSidebar={leftSidebar.toggle}
          />
          <EditorContent
            editor={editor}
            ref={editorRef}
            className="flex-1 overflow-y-visible w-full h-full"
          />
          <ContentItemMenu editor={editor} />
          <LinkMenu editor={editor} appendTo={menuContainerRef} />

          <TextMenu editor={editor} />
          <IframeMenu editor={editor} appendTo={menuContainerRef} />
          <SocialMediaMenu editor={editor} appendTo={menuContainerRef} />
          <ColumnsMenu editor={editor} appendTo={menuContainerRef} />
          <TableRowMenu editor={editor} appendTo={menuContainerRef} />
          <TableColumnMenu editor={editor} appendTo={menuContainerRef} />
          <ImageBlockMenu editor={editor} appendTo={menuContainerRef} />
        </div>
      </div>
    </EditorContext.Provider>
  )
}

export default BlockEditor
