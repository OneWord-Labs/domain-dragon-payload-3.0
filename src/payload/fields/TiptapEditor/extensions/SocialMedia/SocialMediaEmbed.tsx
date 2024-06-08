import { NodeViewContent, NodeViewWrapper } from '@tiptap/react'
import './socialMedia.scss'

// eslint-disable-next-line import/no-anonymous-default-export, react/display-name
export default ({ props, children, Icon, text }: any) => {
  return (
    <NodeViewWrapper
      className="react-component"
      onClick={() => {
        props.editor.commands.setNodeSelection(props.getPos())
      }}
    >
      <NodeViewContent contentEditable="false" className="socialMediaContainer">
        {props?.node.type.spec.draggable ? (
          <div draggable="true" data-drag-handle="" style={{ width: '100%' }}>
            {!props?.node?.attrs?.url ?? '' ? (
              <div
                className="w-full bg-zinc-100 py-8 px-6 flex items-center justify-center gap-2 socialMediaCard"
                draggable="true"
                data-drag-handle=""
                contentEditable="false"
              >
                <Icon size={24} />
                <p
                  className="w-full flex items-center justify-start mt-0"
                  style={{
                    marginTop: 0,
                  }}
                >
                  {text}
                </p>
              </div>
            ) : (
              <div
                style={{ display: 'flex', justifyContent: 'center' }}
                draggable="true"
                data-drag-handle=""
                contentEditable="false"
              >
                {children}
              </div>
            )}
          </div>
        ) : null}
      </NodeViewContent>
    </NodeViewWrapper>
  )
}
