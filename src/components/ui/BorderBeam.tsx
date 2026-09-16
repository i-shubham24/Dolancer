export function BorderBeam({
  className = '',
  beamSize = 2,
  duration = 4,
}: {
  className?: string;
  beamSize?: number;
  duration?: number;
}) {
  return (
    <div className={`pointer-events-none absolute inset-0 z-0 overflow-hidden rounded-[inherit] ${className}`}>
      <style>{`
        @property --beam-angle {
          syntax: '<angle>';
          inherits: false;
          initial-value: 0deg;
        }
        @keyframes border-beam-spin {
          to { --beam-angle: 360deg; }
        }
        .border-beam-bg {
          background: conic-gradient(from var(--beam-angle), transparent 80%, var(--color-coral, #ff7b54), var(--color-blue, #3b82f6), transparent);
          animation: border-beam-spin ${duration}s linear infinite;
        }
      `}</style>
      
      {/* The rotating gradient layer */}
      <div
        className="border-beam-bg absolute top-1/2 left-1/2 z-0 aspect-square w-[200%] -translate-x-1/2 -translate-y-1/2"
      />
      
      {/* The inner cutout background to hide the center. 
          Using var(--color-surface) since that's what the card uses. 
          If inheriting is tricky, we just hardcode the surface color. */}
      <div 
        className="absolute z-10 rounded-[inherit]"
        style={{
            background: 'var(--color-surface)',
            top: `${beamSize}px`,
            left: `${beamSize}px`,
            right: `${beamSize}px`,
            bottom: `${beamSize}px`,
        }}
      />
    </div>
  );
}
