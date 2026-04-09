export default function SkeletonCard() {
  return (
    <div className="glass" style={{ width: '200px', overflow: 'hidden', flexShrink: 0 }}>
      <div className="skeleton" style={{ height: '140px' }} />
      <div style={{ padding: '10px 12px 12px' }}>
        <div className="skeleton" style={{ height: '14px', marginBottom: '8px', borderRadius: '4px' }} />
        <div className="skeleton" style={{ height: '10px', width: '60%', borderRadius: '4px' }} />
      </div>
    </div>
  );
}
