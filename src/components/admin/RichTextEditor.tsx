'use client'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import TextAlign from '@tiptap/extension-text-align'
import { TextStyle } from '@tiptap/extension-text-style'
import Color from '@tiptap/extension-color'
import Placeholder from '@tiptap/extension-placeholder'
import { useEffect, useRef, useCallback } from 'react'

interface RichTextEditorProps {
  value: string
  onChange: (html: string) => void
  onImageUpload?: (file: File) => Promise<string>
  placeholder?: string
}

function ToolbarBtn({
  onClick, active, title, children,
}: {
  onClick: () => void; active?: boolean; title: string; children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onMouseDown={e => { e.preventDefault(); onClick() }}
      title={title}
      className={`p-1.5 rounded text-sm leading-none transition-colors ${
        active ? 'bg-gray-200 text-gray-900' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
      }`}
    >
      {children}
    </button>
  )
}

function Divider() {
  return <span className="w-px h-5 bg-gray-200 mx-0.5 self-center" />
}

export default function RichTextEditor({ value, onChange, onImageUpload, placeholder }: RichTextEditorProps) {
  const fileRef = useRef<HTMLInputElement>(null)
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [1, 2, 3] } }),
      Underline,
      TextStyle,
      Color,
      Link.configure({ openOnClick: false, HTMLAttributes: { class: 'text-blue-600 underline' } }),
      Image.configure({ HTMLAttributes: { class: 'max-w-full rounded' } }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Placeholder.configure({ placeholder: placeholder ?? 'Напиши нещо...' }),
    ],
    content: value,
    editorProps: {
      attributes: {
        class: 'prose prose-lg max-w-none min-h-[400px] p-4 focus:outline-none',
      },
    },
    onUpdate({ editor }) {
      onChange(editor.getHTML())
    },
  })

  // Sync external value changes (e.g. reset)
  useEffect(() => {
    if (!editor) return
    if (editor.getHTML() !== value) {
      editor.commands.setContent(value)
    }
  }, [value, editor])

  const addLink = useCallback(() => {
    if (!editor) return
    const prev = editor.getAttributes('link').href ?? ''
    const url = window.prompt('URL:', prev)
    if (url === null) return
    if (url === '') { editor.chain().focus().unsetLink().run(); return }
    editor.chain().focus().setLink({ href: url }).run()
  }, [editor])

  const handleImageFile = useCallback(async (file: File) => {
    if (!editor || !onImageUpload) return
    const url = await onImageUpload(file)
    editor.chain().focus().setImage({ src: url }).run()
  }, [editor, onImageUpload])

  const addImageUrl = useCallback(() => {
    if (!editor) return
    const url = window.prompt('URL на снимката:')
    if (url) editor.chain().focus().setImage({ src: url }).run()
  }, [editor])

  if (!editor) return null

  const h = editor.isActive('heading', { level: 1 }) ? 1
    : editor.isActive('heading', { level: 2 }) ? 2
    : editor.isActive('heading', { level: 3 }) ? 3 : 0

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 p-2 border-b border-gray-200 bg-gray-50">
        {/* Headings */}
        <ToolbarBtn onClick={() => editor.chain().focus().setParagraph().run()} active={editor.isActive('paragraph')} title="Параграф">P</ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} active={h === 1} title="Заглавие 1"><b>H1</b></ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={h === 2} title="Заглавие 2"><b>H2</b></ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={h === 3} title="Заглавие 3"><b>H3</b></ToolbarBtn>

        <Divider />

        {/* Formatting */}
        <ToolbarBtn onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')} title="Удебелен"><b>B</b></ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')} title="Курсив"><i>I</i></ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive('underline')} title="Подчертан"><u>U</u></ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive('strike')} title="Зачертан"><s>S</s></ToolbarBtn>

        <Divider />

        {/* Alignment */}
        <ToolbarBtn onClick={() => editor.chain().focus().setTextAlign('left').run()} active={editor.isActive({ textAlign: 'left' })} title="Ляво">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor"><rect x="0" y="1" width="14" height="2"/><rect x="0" y="5" width="10" height="2"/><rect x="0" y="9" width="14" height="2"/><rect x="0" y="11" width="8" height="2"/></svg>
        </ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().setTextAlign('center').run()} active={editor.isActive({ textAlign: 'center' })} title="Центриране">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor"><rect x="0" y="1" width="14" height="2"/><rect x="2" y="5" width="10" height="2"/><rect x="0" y="9" width="14" height="2"/><rect x="3" y="11" width="8" height="2"/></svg>
        </ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().setTextAlign('right').run()} active={editor.isActive({ textAlign: 'right' })} title="Дясно">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor"><rect x="0" y="1" width="14" height="2"/><rect x="4" y="5" width="10" height="2"/><rect x="0" y="9" width="14" height="2"/><rect x="6" y="11" width="8" height="2"/></svg>
        </ToolbarBtn>

        <Divider />

        {/* Lists */}
        <ToolbarBtn onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive('bulletList')} title="Списък">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor"><circle cx="1.5" cy="2" r="1.5"/><rect x="4" y="1" width="10" height="2"/><circle cx="1.5" cy="7" r="1.5"/><rect x="4" y="6" width="10" height="2"/><circle cx="1.5" cy="12" r="1.5"/><rect x="4" y="11" width="10" height="2"/></svg>
        </ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive('orderedList')} title="Номериран списък">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor"><text x="0" y="4" fontSize="5" fontFamily="monospace">1.</text><rect x="5" y="1" width="9" height="2"/><text x="0" y="9" fontSize="5" fontFamily="monospace">2.</text><rect x="5" y="6" width="9" height="2"/><text x="0" y="14" fontSize="5" fontFamily="monospace">3.</text><rect x="5" y="11" width="9" height="2"/></svg>
        </ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive('blockquote')} title="Цитат">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor"><path d="M0 2h4v4H2c0 2 .5 3 2 4H2C.5 9 0 7 0 5V2zm7 0h4v4H9c0 2 .5 3 2 4H9C7.5 9 7 7 7 5V2z"/></svg>
        </ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().toggleCode().run()} active={editor.isActive('code')} title="Код">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5"><polyline points="4,3 1,7 4,11"/><polyline points="10,3 13,7 10,11"/></svg>
        </ToolbarBtn>

        <Divider />

        {/* Link */}
        <ToolbarBtn onClick={addLink} active={editor.isActive('link')} title="Линк">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M6 8a3 3 0 0 0 4.243 0l1.414-1.414A3 3 0 0 0 7.414 2.343L6.707 3.05"/><path d="M8 6a3 3 0 0 0-4.243 0L2.343 7.414A3 3 0 0 0 6.586 11.657l.707-.707"/></svg>
        </ToolbarBtn>

        {/* Image */}
        {onImageUpload && (
          <ToolbarBtn onClick={() => fileRef.current?.click()} title="Качи снимка">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="1" y="2" width="12" height="10" rx="1"/><circle cx="5" cy="5.5" r="1.2"/><polyline points="1,10 4,7 6,9 9,6 13,10"/></svg>
          </ToolbarBtn>
        )}
        <ToolbarBtn onClick={addImageUrl} title="Снимка по URL">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="1" y="2" width="12" height="10" rx="1"/><path d="M7 6v4M5 8h4"/></svg>
        </ToolbarBtn>

        <Divider />

        {/* Undo / Redo */}
        <ToolbarBtn onClick={() => editor.chain().focus().undo().run()} title="Отмени">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M2 7a5 5 0 1 0 1-3.5"/><polyline points="2,3 2,7 6,7"/></svg>
        </ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().redo().run()} title="Повтори">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 7a5 5 0 1 1-1-3.5"/><polyline points="12,3 12,7 8,7"/></svg>
        </ToolbarBtn>
      </div>

      {/* Editor area */}
      <EditorContent editor={editor} className="bg-white" />

      {/* Hidden file input */}
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={e => { if (e.target.files?.[0]) handleImageFile(e.target.files[0]) }}
      />
    </div>
  )
}
