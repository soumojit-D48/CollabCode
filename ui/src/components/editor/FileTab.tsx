'use client'

import { X, FileCode } from 'lucide-react'
import { RoomFile } from '@/types'

interface FileTabsProps {
  files:        RoomFile[]
  openFileIds:  string[]
  activeFileId: string | null
  onTabClick:   (fileId: string) => void
  onTabClose:   (fileId: string) => void
}

export default function FileTabs({
  files,
  openFileIds,
  activeFileId,
  onTabClick,
  onTabClose,
}: FileTabsProps) {
  const openFiles = openFileIds
    .map((id) => files.find((f) => f.id === id))
    .filter(Boolean) as RoomFile[]

  if (openFiles.length === 0) return null

  return (
    <div
      style={{
        display:         'flex',
        alignItems:      'center',
        backgroundColor: 'var(--color-surface)',
        borderBottom:    '1px solid var(--color-border)',
        overflowX:       'auto',
        flexShrink:      0,
        height:          '36px',
      }}
    >
      {openFiles.map((file) => {
        const isActive = file.id === activeFileId

        return (
          <div
            key={file.id}
            onClick={() => onTabClick(file.id)}
            style={{
              display:         'flex',
              alignItems:      'center',
              gap:             6,
              padding:         '0 12px',
              height:          '100%',
              cursor:          'pointer',
              borderRight:     '1px solid var(--color-border)',
              backgroundColor: isActive
                ? 'var(--color-bg)'
                : 'transparent',
              borderTop: isActive
                ? '2px solid var(--color-brand)'
                : '2px solid transparent',
              borderBottom: 'none',
              flexShrink: 0,
            }}
            className="group"
          >
            <FileCode
              size={12}
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
                  : 'var(--color-text-muted)',
                whiteSpace: 'nowrap',
              }}
            >
              {file.name}
            </span>
            <button
              onClick={(e) => { e.stopPropagation(); onTabClose(file.id) }}
              style={{
                color:      'transparent',
                marginLeft: 2,
                padding:    2,
                borderRadius: '2px',
                display:    'flex',
              }}
              className="group-hover:text-[var(--color-text-muted)] hover:!text-[var(--color-text)] transition-colors"
            >
              <X size={11} />
            </button>
          </div>
        )
      })}
    </div>
  )
}