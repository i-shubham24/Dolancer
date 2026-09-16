import React from 'react';

interface BorderBeamProps {
  children?: React.ReactNode;
  className?: string;
  beamSize?: number;
  duration?: number;
}

export function BorderBeam({
  children,
  className = '',
  beamSize = 2,
  duration = 4,
}: BorderBeamProps) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
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
      
      {/* The inner card background which hides the middle of the gradient */}
      <div 
        className="absolute z-10 bg-inherit"
        style={{
            top: `${beamSize}px`,
            left: `${beamSize}px`,
            right: `${beamSize}px`,
            bottom: `${beamSize}px`,
            borderRadius: 'inherit'
        }}
      />
      
      {/* Content wrapper */}
      <div className="relative z-20 h-full w-full">
        {children}
      </div>
    </div>
  );
}
