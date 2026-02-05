import { useEffect, useState } from 'react';

interface LoadingScreenProps {
  progress?: number; // 0-100 for determinate mode
}

export default function LoadingScreen({ progress }: LoadingScreenProps) {
  const [phase, setPhase] = useState<'visible' | 'fading' | 'unmounted'>('visible');
  const [animationProgress, setAnimationProgress] = useState(0);

  useEffect(() => {
    if (progress !== undefined) {
      // Determinate mode: use provided progress
      setAnimationProgress(progress);
      if (progress >= 100) {
        const timer = setTimeout(() => setPhase('fading'), 300);
        return () => clearTimeout(timer);
      }
    } else {
      // Indeterminate mode: time-based animation (4 seconds total)
      const duration = 4000;
      const startTime = Date.now();
      
      const interval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const newProgress = Math.min((elapsed / duration) * 100, 100);
        setAnimationProgress(newProgress);
        
        if (newProgress >= 100) {
          clearInterval(interval);
          setTimeout(() => setPhase('fading'), 300);
        }
      }, 16); // ~60fps

      return () => clearInterval(interval);
    }
  }, [progress]);

  useEffect(() => {
    if (phase === 'fading') {
      const timer = setTimeout(() => setPhase('unmounted'), 600);
      return () => clearTimeout(timer);
    }
  }, [phase]);

  if (phase === 'unmounted') return null;

  return (
    <div 
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white transition-opacity duration-500 ${
        phase === 'fading' ? 'opacity-0' : 'opacity-100'
      }`}
      style={{ pointerEvents: phase === 'fading' ? 'none' : 'auto' }}
    >
      {/* SVG Animation Container */}
      <div className="relative w-full max-w-md h-96 flex items-center justify-center px-8">
        <svg
          viewBox="0 0 400 400"
          className="w-full h-full max-w-[400px] max-h-[400px]"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Soft shadow */}
          <defs>
            <filter id="soft-shadow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceAlpha" stdDeviation="8"/>
              <feOffset dx="0" dy="4" result="offsetblur"/>
              <feComponentTransfer>
                <feFuncA type="linear" slope="0.2"/>
              </feComponentTransfer>
              <feMerge>
                <feMergeNode/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          {/* Book - Closed state (0-20%) */}
          <g className="book-closed" style={{ opacity: animationProgress < 20 ? 1 : 0 }}>
            <rect
              x="150"
              y="180"
              width="100"
              height="120"
              rx="4"
              fill="#8B4513"
              filter="url(#soft-shadow)"
            />
            <rect
              x="155"
              y="185"
              width="90"
              height="110"
              rx="2"
              fill="#A0522D"
            />
            <line x1="200" y1="185" x2="200" y2="295" stroke="#8B4513" strokeWidth="2"/>
          </g>

          {/* Book - Opening animation (20-40%) */}
          <g className="book-opening">
            {/* Left page */}
            <path
              d={`M 200 180 L ${200 - Math.min(animationProgress - 20, 20) * 2} 180 L ${200 - Math.min(animationProgress - 20, 20) * 2} 300 L 200 300 Z`}
              fill="#F5E6D3"
              stroke="#8B4513"
              strokeWidth="2"
              filter="url(#soft-shadow)"
              style={{
                opacity: animationProgress >= 20 ? 1 : 0,
                transformOrigin: '200px 240px',
              }}
            />
            {/* Right page */}
            <path
              d={`M 200 180 L ${200 + Math.min(animationProgress - 20, 20) * 2} 180 L ${200 + Math.min(animationProgress - 20, 20) * 2} 300 L 200 300 Z`}
              fill="#F5E6D3"
              stroke="#8B4513"
              strokeWidth="2"
              filter="url(#soft-shadow)"
              style={{
                opacity: animationProgress >= 20 ? 1 : 0,
                transformOrigin: '200px 240px',
              }}
            />
            {/* Book spine */}
            <rect
              x="198"
              y="180"
              width="4"
              height="120"
              fill="#8B4513"
              style={{ opacity: animationProgress >= 20 ? 1 : 0 }}
            />
          </g>

          {/* Soil appearing (40-55%) */}
          <ellipse
            cx="200"
            cy="290"
            rx={Math.min(Math.max(animationProgress - 40, 0), 15) * 2}
            ry={Math.min(Math.max(animationProgress - 40, 0), 15) * 0.6}
            fill="#6B4423"
            style={{ opacity: animationProgress >= 40 ? 1 : 0 }}
          />

          {/* Sprout emerging (55-70%) */}
          <g className="sprout" style={{ opacity: animationProgress >= 55 ? 1 : 0 }}>
            {/* Stem */}
            <line
              x1="200"
              y1="290"
              x2="200"
              y2={290 - Math.min(Math.max(animationProgress - 55, 0), 15) * 2}
              stroke="#2E7D32"
              strokeWidth="3"
              strokeLinecap="round"
            />
            {/* Small leaves on sprout */}
            {animationProgress >= 60 && (
              <>
                <ellipse
                  cx="195"
                  cy={290 - Math.min(Math.max(animationProgress - 55, 0), 15) * 1.5}
                  rx="5"
                  ry="8"
                  fill="#4CAF50"
                  transform={`rotate(-30 195 ${290 - Math.min(Math.max(animationProgress - 55, 0), 15) * 1.5})`}
                />
                <ellipse
                  cx="205"
                  cy={290 - Math.min(Math.max(animationProgress - 55, 0), 15) * 1.5}
                  rx="5"
                  ry="8"
                  fill="#4CAF50"
                  transform={`rotate(30 205 ${290 - Math.min(Math.max(animationProgress - 55, 0), 15) * 1.5})`}
                />
              </>
            )}
          </g>

          {/* Plant growing with leaves (70-100%) */}
          <g className="plant" style={{ opacity: animationProgress >= 70 ? 1 : 0 }}>
            {/* Main stem */}
            <line
              x1="200"
              y1="290"
              x2="200"
              y2={290 - Math.min(Math.max(animationProgress - 70, 0), 30) * 2.5}
              stroke="#2E7D32"
              strokeWidth="4"
              strokeLinecap="round"
            />
            
            {/* Leaf 1 - Bottom left */}
            {animationProgress >= 75 && (
              <g className="leaf-1" style={{ 
                animation: 'leaf-grow 0.4s ease-out forwards',
                transformOrigin: '185px 250px'
              }}>
                <ellipse
                  cx="185"
                  cy="250"
                  rx="12"
                  ry="20"
                  fill="#66BB6A"
                  transform="rotate(-45 185 250)"
                />
                <line x1="200" y1="255" x2="185" y2="250" stroke="#2E7D32" strokeWidth="2"/>
              </g>
            )}
            
            {/* Leaf 2 - Bottom right */}
            {animationProgress >= 80 && (
              <g className="leaf-2" style={{ 
                animation: 'leaf-grow 0.4s ease-out forwards',
                transformOrigin: '215px 245px'
              }}>
                <ellipse
                  cx="215"
                  cy="245"
                  rx="12"
                  ry="20"
                  fill="#66BB6A"
                  transform="rotate(45 215 245)"
                />
                <line x1="200" y1="250" x2="215" y2="245" stroke="#2E7D32" strokeWidth="2"/>
              </g>
            )}
            
            {/* Leaf 3 - Middle left */}
            {animationProgress >= 85 && (
              <g className="leaf-3" style={{ 
                animation: 'leaf-grow 0.4s ease-out forwards',
                transformOrigin: '180px 225px'
              }}>
                <ellipse
                  cx="180"
                  cy="225"
                  rx="14"
                  ry="22"
                  fill="#4CAF50"
                  transform="rotate(-50 180 225)"
                />
                <line x1="200" y1="230" x2="180" y2="225" stroke="#2E7D32" strokeWidth="2"/>
              </g>
            )}
            
            {/* Leaf 4 - Top right */}
            {animationProgress >= 90 && (
              <g className="leaf-4" style={{ 
                animation: 'leaf-grow 0.4s ease-out forwards',
                transformOrigin: '220px 215px'
              }}>
                <ellipse
                  cx="220"
                  cy="215"
                  rx="14"
                  ry="22"
                  fill="#4CAF50"
                  transform="rotate(50 220 215)"
                />
                <line x1="200" y1="220" x2="220" y2="215" stroke="#2E7D32" strokeWidth="2"/>
              </g>
            )}
          </g>
        </svg>
      </div>

      {/* Loading Text */}
      <div className="mt-8 text-center px-4">
        <p 
          className="text-base font-medium text-primary transition-opacity duration-500"
          style={{ 
            opacity: Math.min(1, animationProgress / 20),
            color: 'oklch(0.35 0.15 145)'
          }}
        >
          Cultivating agricultural knowledge…
        </p>
      </div>
    </div>
  );
}
