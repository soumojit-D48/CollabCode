export default function Loading() {
  return (
    <div
      style={{ backgroundColor: 'var(--color-bg)', minHeight: '100vh' }}
    >
      <div
        style={{
          backgroundColor: 'var(--color-surface)',
          borderBottom: '1px solid var(--color-border)',
          height: '56px',
        }}
      />

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div
              style={{
                backgroundColor: 'var(--color-surface-2)',
                borderRadius: 'var(--radius-md)',
                width: 80,
                height: 28,
                marginBottom: 8,
              }}
            />
            <div
              style={{
                backgroundColor: 'var(--color-surface-2)',
                borderRadius: 'var(--radius-md)',
                width: 220,
                height: 16,
              }}
            />
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              style={{
                backgroundColor: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-lg)',
                height: 100,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
