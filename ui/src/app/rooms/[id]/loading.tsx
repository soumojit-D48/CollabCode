export default function Loading() {
  return (
    <div
      style={{
        backgroundColor: 'var(--color-bg)',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Top bar skeleton */}
      <div
        style={{
          backgroundColor: 'var(--color-surface)',
          borderBottom: '1px solid var(--color-border)',
          height: '48px',
        }}
      />

      {/* Editor + chat skeleton */}
      <div style={{ flex: 1, display: 'flex' }}>
        {/* Editor area */}
        <div
          style={{
            flex: 1,
            backgroundColor: '#1e1e1e',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              color: 'var(--color-text-muted)',
              fontSize: '13px',
            }}
          >
            Loading editor...
          </span>
        </div>

        {/* Chat skeleton */}
        <div
          style={{
            width: 300,
            borderLeft: '1px solid var(--color-border)',
            backgroundColor: 'var(--color-surface)',
          }}
        />
      </div>
    </div>
  )
}