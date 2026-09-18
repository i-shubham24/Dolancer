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
          background: conic-gradient(from var(--beam-angle), transparent 80%, var(--color-primary, #ff7b54), var(--color-secondary, #3b82f6), transparent);
          animation: border-beam-spin ${duration}s linear infinite;
        }
        .border-beam-mask {
          mask: 
            linear-gradient(#fff 0 0) content-box, 
            linear-gradient(#fff 0 0);
          mask-composite: exclude;
          -webkit-mask: 
            linear-gradient(#fff 0 0) content-box, 
            linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
        }
      `}</style>
      
      {/* The masking is applied to a full-size wrapper so the border is precise */}
      <div className="absolute inset-0 z-0 rounded-[inherit] border-beam-mask" style={{ padding: `${beamSize}px` }}>
        {/* The rotating gradient layer which is oversized to cover corners during rotation */}
        <div
          className="border-beam-bg absolute top-1/2 left-1/2 aspect-square w-[200%] -translate-x-1/2 -translate-y-1/2"
        />
      </div>
    </div>
  );
}
