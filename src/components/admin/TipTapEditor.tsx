'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'

interface Props {
  content: string
  onChange: (html: string) => void
}

export default function TipTapEditor({ content, onChange }: Props) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Link.configure({ openOnClick: false }),
    ],
    content,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: {
        class: 'prose-tiptap min-h-[300px] outline-none px-5 py-4',
      },
    },
  })

  if (!editor) return null

  const btnCls = (active: boolean) =>
    `px-2.5 py-1 text-xs border transition-colors ${active ? 'border-[#c9a84c] text-[#c9a84c]' : 'border-white/[0.07] text-white/40 hover:text-white'}`

  return (
    <div className="border border-white/[0.07] bg-[#0c0d10]">
      <div className="flex flex-wrap gap-1 p-2 border-b border-white/[0.07]">
        <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={btnCls(editor.isActive('bold'))}>B</button>
        <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={btnCls(editor.isActive('italic'))}>I</button>
        <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={btnCls(editor.isActive('heading', { level: 2 }))}>H2</button>
        <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} className={btnCls(editor.isActive('heading', { level: 3 }))}>H3</button>
        <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className={btnCls(editor.isActive('bulletList'))}>UL</button>
        <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()} className={btnCls(editor.isActive('orderedList'))}>OL</button>
        <button type="button" onClick={() => editor.chain().focus().toggleBlockquote().run()} className={btnCls(editor.isActive('blockquote'))}>Quote</button>
        <button type="button" onClick={() => editor.chain().focus().toggleCode().run()} className={btnCls(editor.isActive('code'))}>Code</button>
        <button
          type="button"
          onClick={() => {
            const url = window.prompt('Link URL:')
            if (url) editor.chain().focus().setLink({ href: url, target: '_blank', rel: 'noopener noreferrer' }).run()
          }}
          className={btnCls(editor.isActive('link'))}
        >
          Link
        </button>
        <button
          type="button"
          onClick={() => {
            const url = window.prompt('Image URL:')
            if (url) editor.chain().focus().setImage({ src: url }).run()
          }}
          className={btnCls(false)}
        >
          Img
        </button>
      </div>
      <EditorContent editor={editor} />
    </div>
  )
}
