'use client'

import { useRef, useEffect, useCallback } from 'react'
import dynamic from 'next/dynamic'
import type { OnMount, OnChange } from '@monaco-editor/react'
import type * as Monaco from 'monaco-editor'
import { useEditorStore } from '@/store/editor.store'

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), {
  ssr: false,
  loading: () => (
    <div
      style={{
        flex: 1,
        backgroundColor: '#1e1e1e',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          fontFamily: 'var(--font-mono)',
          color: 'var(--color-text-muted)',
          fontSize: '13px',
        }}
      >
        Loading editor...
      </div>
    </div>
  ),
})

interface CodeEditorProps {
  roomId:          string
  content:         string
  onCodeChange:    (content: string) => void
  onCursorChange:  (line: number, column: number) => void
}

let isRemoteUpdate = false

export default function CodeEditor({
  roomId,
  content,
  onCodeChange,
  onCursorChange,
}: CodeEditorProps) {
  const editorRef      = useRef<Monaco.editor.IStandaloneCodeEditor | null>(null)
  const decorationsRef = useRef<string[]>([])

  const language    = useEditorStore((s) => s.language)
  const cursors     = useEditorStore((s) => s.cursors)
  const activeUsers = useEditorStore((s) => s.activeUsers)

  const handleMount: OnMount = (editor) => {
    editorRef.current = editor

    editor.onDidChangeCursorPosition((e) => {
      onCursorChange(e.position.lineNumber, e.position.column)
    })
  }

  const handleChange: OnChange = (value) => {
    if (isRemoteUpdate) return
    if (value !== undefined) onCodeChange(value)
  }

  useEffect(() => {
    const editor = editorRef.current
    if (!editor) return

    const current = editor.getValue()
    if (current === content) return

    isRemoteUpdate = true

    const position = editor.getPosition()
    editor.setValue(content)
    if (position) editor.setPosition(position)

    isRemoteUpdate = false
  }, [content])

  useEffect(() => {
    const editor = editorRef.current
    if (!editor) return

    const newDecorations = Object.values(cursors).map((cursor) => ({
      range: {
        startLineNumber: cursor.line,
        startColumn:     cursor.column,
        endLineNumber:   cursor.line,
        endColumn:       cursor.column + 1,
      },
      options: {
        className:       `cursor-${cursor.userId.slice(0, 8)}`,
        beforeContentClassName: `cursor-label-${cursor.userId.slice(0, 8)}`,
        stickiness: 1,
      },
    }))

    Object.values(cursors).forEach((cursor) => {
      const shortId = cursor.userId.slice(0, 8)
      const styleId = `cursor-style-${shortId}`

      if (!document.getElementById(styleId)) {
        const style = document.createElement('style')
        style.id = styleId
        style.textContent = `
          .cursor-${shortId} {
            border-left: 2px solid ${cursor.color};
            margin-left: -1px;
          }
          .cursor-label-${shortId}::before {
            content: "${cursor.username}";
            background-color: ${cursor.color};
            color: white;
            font-size: 10px;
            font-family: var(--font-mono);
            padding: 1px 4px;
            border-radius: 2px;
            position: absolute;
            top: -18px;
            white-space: nowrap;
            pointer-events: none;
          }
        `
        document.head.appendChild(style)
      }
    })

    decorationsRef.current = editor.deltaDecorations(
      decorationsRef.current,
      newDecorations
    )
  }, [cursors])

  return (
    <div style={{ flex: 1, overflow: 'hidden' }}>
      <MonacoEditor
        height="100%"
        language={language}
        defaultValue=""
        theme="vs-dark"
        onMount={handleMount}
        onChange={handleChange}
        options={{
          fontSize:             14,
          fontFamily:           'var(--font-mono)',
          minimap:              { enabled: false },
          wordWrap:             'on',
          lineNumbers:          'on',
          scrollBeyondLastLine: false,
          automaticLayout:      true,
          tabSize:              2,
          cursorBlinking:       'smooth',
          smoothScrolling:      true,
          padding:              { top: 16, bottom: 16 },
          renderLineHighlight:  'line',
          bracketPairColorization: { enabled: true },
        }}
      />
    </div>
  )
}