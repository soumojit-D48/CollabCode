'use client'

import { useState } from 'react'
import {
  FileCode, FileText, Folder, FolderOpen, ChevronRight,
  Trash2, Plus, File,
} from 'lucide-react'
import { RoomFile } from '@/types'

interface FileTreeProps {
  files:        RoomFile[]
  activeFileId: string | null
  onFileClick:  (file: RoomFile) => void
  onFileDelete: (file: RoomFile) => void
  onNewFile:    () => void
}

const EXT_COLORS: Record<string, string> = {
  ts: '#3178C6', tsx: '#3178C6',
  js: '#F7DF1E', jsx: '#F7DF1E',
  py: '#3572A5',
  go: '#00ADD8',
  rs: '#CE422B',
  java: '#B07219',
  cpp: '#F34B7D', cc: '#F34B7D', c: '#555555',
  css: '#563D7C', html: '#E44D26',
  json: '#8BC34A', md: '#9E9E9E',
}

function getFileIcon(name: string) {
  const ext = name.split('.').pop() ?? ''
  const codeExts = ['ts','tsx','js','jsx','py','go','rs','java','cpp','c','cc']
  if (codeExts.includes(ext)) return FileCode
  if (['json','md','txt','yaml','yml','toml','html','css'].includes(ext)) return File
  return FileText
}

function getExtColor(name: string): string {
  const ext = name.split('.').pop() ?? ''
  return EXT_COLORS[ext] ?? 'var(--color-text-muted)'
}

const buildTree = (files: RoomFile[]) => {
  const folders: Record<string, RoomFile[]> = {}
  const root: RoomFile[] = []
  files.forEach(file => {
    const parts = file.path.split('/').filter(Boolean)
    if (parts.length === 1) { root.push(file) }
    else {
      const folder = parts.slice(0, -1).join('/')
      if (!folders[folder]) folders[folder] = []
      folders[folder].push(file)
    }
  })
  return { root, folders }
}

export default function FileTree({ files, activeFileId, onFileClick, onFileDelete, onNewFile }: FileTreeProps) {
  const [openFolders, setOpenFolders] = useState<Set<string>>(new Set())
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const { root, folders } = buildTree(files)

  const toggleFolder = (folder: string) => {
    setOpenFolders(prev => {
      const next = new Set(prev)
      next.has(folder) ? next.delete(folder) : next.add(folder)
      return next
    })
  }

  const renderFile = (file: RoomFile) => {
    const Icon = getFileIcon(file.name)
    const iconColor = getExtColor(file.name)
    const isActive = file.id === activeFileId
    const isHovered = file.id === hoveredId

    return (
      <div
        key={file.id}
        onClick={() => onFileClick(file)}
        onMouseEnter={() => setHoveredId(file.id)}
        onMouseLeave={() => setHoveredId(null)}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '3px 8px 3px 12px',
          cursor: 'pointer', borderRadius: 'var(--radius-sm)',
          backgroundColor: isActive ? 'var(--color-brand-dim)' : isHovered ? 'var(--color-surface-2)' : 'transparent',
          borderLeft: isActive ? '2px solid var(--color-brand)' : '2px solid transparent',
          transition: 'background-color 0.1s',
          marginBottom: 1,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, minWidth: 0 }}>
          <Icon size={13} style={{ color: isActive ? 'var(--color-brand)' : iconColor, flexShrink: 0 }} />
          <span style={{
            fontSize: '12px', fontFamily: 'var(--font-mono)',
            color: isActive ? 'var(--color-text)' : 'var(--color-text-dim)',
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            fontWeight: isActive ? 600 : 400,
          }}>
            {file.name}
          </span>
        </div>

        {isHovered && (
          <button
            onClick={e => { e.stopPropagation(); onFileDelete(file) }}
            style={{
              color: 'var(--color-text-muted)', background: 'none', border: 'none',
              cursor: 'pointer', padding: '2px', flexShrink: 0,
              borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center',
              transition: 'color 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--color-danger)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--color-text-muted)'}
          >
            <Trash2 size={11} />
          </button>
        )}
      </div>
    )
  }

  return (
    <div style={{
      width: '220px', flexShrink: 0,
      borderRight: '1px solid var(--color-border)',
      backgroundColor: 'var(--color-surface)',
      display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '9px 10px', borderBottom: '1px solid var(--color-border)', flexShrink: 0,
      }}>
        <span style={{
          fontSize: '10px', fontWeight: 700, color: 'var(--color-text-muted)',
          fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.08em',
        }}>
          FILES
        </span>
        <button
          onClick={onNewFile} title="New file"
          style={{
            color: 'var(--color-text-muted)', background: 'none', border: 'none',
            cursor: 'pointer', padding: '3px', borderRadius: 'var(--radius-sm)',
            display: 'flex', alignItems: 'center', transition: 'color 0.15s, background 0.15s',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.color = 'var(--color-text)'
            e.currentTarget.style.backgroundColor = 'var(--color-surface-2)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.color = 'var(--color-text-muted)'
            e.currentTarget.style.backgroundColor = 'transparent'
          }}
        >
          <Plus size={14} />
        </button>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '4px' }}>
        {files.length === 0 ? (
          <div style={{ padding: '20px 12px', textAlign: 'center' }}>
            <div style={{
              width: 32, height: 32, borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--color-surface-2)',
              border: '1px solid var(--color-border)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 10px',
            }}>
              <FileCode size={14} style={{ color: 'var(--color-text-muted)' }} />
            </div>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '12px', marginBottom: 8 }}>No files yet</p>
            <button
              onClick={onNewFile}
              style={{
                color: 'var(--color-brand)', fontSize: '12px',
                background: 'none', border: 'none', cursor: 'pointer',
                fontFamily: 'var(--font-mono)', padding: 0,
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
                      display: 'flex', alignItems: 'center', gap: 4, padding: '3px 6px',
                      cursor: 'pointer', borderRadius: 'var(--radius-sm)', marginBottom: 1,
                      transition: 'background 0.1s',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--color-surface-2)')}
                    onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    <ChevronRight
                      size={11}
                      style={{
                        color: 'var(--color-text-muted)', flexShrink: 0,
                        transform: isOpen ? 'rotate(90deg)' : 'none',
                        transition: 'transform 0.15s',
                      }}
                    />
                    <FolderIcon size={13} style={{ color: 'var(--color-warning)', flexShrink: 0 }} />
                    <span style={{ fontSize: '12px', fontFamily: 'var(--font-mono)', color: 'var(--color-text-dim)' }}>
                      {folder.split('/').pop()}
                    </span>
                  </div>
                  {isOpen && (
                    <div style={{ paddingLeft: '12px' }}>{folderFiles.map(renderFile)}</div>
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