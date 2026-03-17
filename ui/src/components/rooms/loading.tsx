export default function Loading() {
  return (
    <div
      style={{ backgroundColor: 'var(--color-bg)', minHeight: '100vh' }}
    >
      {/* Navbar skeleton */}
      <div
        style={{
          backgroundColor: 'var(--color-surface)',
          borderBottom: '1px solid var(--color-border)',
          height: '56px',
        }}
      />

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header skeleton */}
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

        {/* Cards skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              style={{
                backgroundColor: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-lg)',
                height: 100,
                opacity: 1 - i * 0.1,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}