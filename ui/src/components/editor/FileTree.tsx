'use client'

import { useState } from 'react'
import {
  FileCode, FileText, Folder, FolderOpen,
  Trash2, Plus, MoreHorizontal,
} from 'lucide-react'
import { RoomFile } from '@/types'
import { useEditorStore } from '@/store/editor.store'

interface FileTreeProps {
  files:        RoomFile[]
  activeFileId: string | null
  onFileClick:  (file: RoomFile) => void
  onFileDelete: (file: RoomFile) => void
  onNewFile:    () => void
}

const getFileIcon = (name: string) => {
  const ext = name.split('.').pop() ?? ''
  const codeExts = ['ts','tsx','js','jsx','py','go','rs','java','cpp','c','css','html']
  return codeExts.includes(ext) ? FileCode : FileText
}

const buildTree = (files: RoomFile[]) => {
  const folders: Record<string, RoomFile[]> = {}
  const root: RoomFile[] = []

  files.forEach((file) => {
    const parts = file.path.split('/').filter(Boolean)
    if (parts.length === 1) {
      root.push(file)
    } else {
      const folder = parts.slice(0, -1).join('/')
      if (!folders[folder]) folders[folder] = []
      folders[folder].push(file)
    }
  })

  return { root, folders }
}

export default function FileTree({
  files,
  activeFileId,
  onFileClick,
  onFileDelete,
  onNewFile,
}: FileTreeProps) {
  const [openFolders, setOpenFolders] = useState<Set<string>>(new Set())
  const [hoveredId,   setHoveredId]   = useState<string | null>(null)

  const { root, folders } = buildTree(files)

  const toggleFolder = (folder: string) => {
    setOpenFolders((prev) => {
      const next = new Set(prev)
      next.has(folder) ? next.delete(folder) : next.add(folder)
      return next
    })
  }

  const renderFile = (file: RoomFile) => {
    const Icon      = getFileIcon(file.name)
    const isActive  = file.id === activeFileId
    const isHovered = file.id === hoveredId

    return (
      <div
        key={file.id}
        onClick={() => onFileClick(file)}
        onMouseEnter={() => setHoveredId(file.id)}
        onMouseLeave={() => setHoveredId(null)}
        style={{
          display:         'flex',
          alignItems:      'center',
          justifyContent:  'space-between',
          padding:         '4px 8px 4px 16px',
          cursor:          'pointer',
          borderRadius:    'var(--radius-sm)',
          backgroundColor: isActive
            ? 'var(--color-brand-dim)'
            : isHovered
            ? 'var(--color-surface-2)'
            : 'transparent',
          borderLeft: isActive
            ? '2px solid var(--color-brand)'
            : '2px solid transparent',
        }}
      >
        <div className="flex items-center gap-1.5 min-w-0">
          <Icon
            size={13}
            style={{
              color: isActive
                ? 'var(--color-brand)'
                : 'var(--color-text-muted)',
              flexShrink: 0,
            }}
          />
          <span
            style={{
              fontSize:   '12px',
              fontFamily: 'var(--font-mono)',
              color: isActive
                ? 'var(--color-text)'
                : 'var(--color-text-dim)',
              overflow:     'hidden',
              textOverflow: 'ellipsis',
              whiteSpace:   'nowrap',
            }}
          >
            {file.name}
          </span>
        </div>

        {isHovered && (
          <button
            onClick={(e) => { e.stopPropagation(); onFileDelete(file) }}
            style={{ color: 'var(--color-text-muted)', flexShrink: 0 }}
            className="hover:text-[var(--color-danger)] transition-colors p-0.5"
          >
            <Trash2 size={11} />
          </button>
        )}
      </div>
    )
  }

  return (
    <div
      style={{
        width:           '220px',
        flexShrink:      0,
        borderRight:     '1px solid var(--color-border)',
        backgroundColor: 'var(--color-surface)',
        display:         'flex',
        flexDirection:   'column',
        height:          '100%',
        overflow:        'hidden',
      }}
    >
      <div
        style={{
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'space-between',
          padding:        '8px 10px',
          borderBottom:   '1px solid var(--color-border)',
          flexShrink:     0,
        }}
      >
        <span
          style={{
            fontSize:   '11px',
            fontWeight: 600,
            color:      'var(--color-text-muted)',
            fontFamily: 'var(--font-mono)',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}
        >
          Files
        </span>
        <button
          onClick={onNewFile}
          title="New file"
          style={{ color: 'var(--color-text-muted)' }}
          className="hover:text-[var(--color-text)] transition-colors"
        >
          <Plus size={15} />
        </button>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '6px 4px' }}>
        {files.length === 0 ? (
          <div
            style={{
              padding:   '16px 12px',
              textAlign: 'center',
            }}
          >
            <p style={{ color: 'var(--color-text-muted)', fontSize: '12px' }}>
              No files yet
            </p>
            <button
              onClick={onNewFile}
              style={{
                color:      'var(--color-brand)',
                fontSize:   '12px',
                marginTop:  '6px',
                background: 'none',
                border:     'none',
                cursor:     'pointer',
              }}
            >
              + Create first file
            </button>
          </div>
        ) : (
          <>
            {root.map(renderFile)}

            {Object.entries(folders).map(([folder, folderFiles]) => {
              const isOpen = openFolders.has(folder)
              const FolderIcon = isOpen ? FolderOpen : Folder

              return (
                <div key={folder}>
                  <div
                    onClick={() => toggleFolder(folder)}
                    style={{
                      display:    'flex',
                      alignItems: 'center',
                      gap:        6,
                      padding:    '4px 8px',
                      cursor:     'pointer',
                      borderRadius: 'var(--radius-sm)',
                    }}
                    className="hover:bg-[var(--color-surface-2)]"
                  >
                    <FolderIcon
                      size={13}
                      style={{ color: 'var(--color-warning)', flexShrink: 0 }}
                    />
                    <span
                      style={{
                        fontSize:   '12px',
                        fontFamily: 'var(--font-mono)',
                        color:      'var(--color-text-dim)',
                      }}
                    >
                      {folder.split('/').pop()}
                    </span>
                  </div>

                  {isOpen && (
                    <div style={{ paddingLeft: '12px' }}>
                      {folderFiles.map(renderFile)}
                    </div>
                  )}
                </div>
              )
            })}
          </>
        )}
      </div>
    </div>
  )
}