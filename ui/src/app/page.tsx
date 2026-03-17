import { redirect } from 'next/navigation'

// Root page — just redirect
// Middleware handles auth-based redirects
export default function RootPage() {
  redirect('/login')
}