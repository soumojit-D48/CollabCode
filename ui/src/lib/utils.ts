import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function timeAgo(date: string | Date): string {
  const now  = new Date()
  const then = new Date(date)
  const diff = Math.floor((now.getTime() - then.getTime()) / 1000)

  if (diff < 60)   return 'just now'
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return then.toLocaleDateString()
}

export const LANGUAGE_COLORS: Record<string, string> = {
  javascript: '#F7DF1E',
  typescript: '#3178C6',
  python:     '#3572A5',
  go:         '#00ADD8',
  rust:       '#CE422B',
  java:       '#B07219',
  cpp:        '#F34B7D',
  c:          '#555555',
}

export const getLanguageColor = (lang: string) =>
  LANGUAGE_COLORS[lang] ?? '#64748B'

export const CURSOR_COLORS = [
  '#F87171', '#FB923C', '#FBBF24', '#34D399',
  '#60A5FA', '#A78BFA', '#F472B6', '#2DD4BF',
]

export const getInitials = (username: string) =>
  username.slice(0, 2).toUpperCase()