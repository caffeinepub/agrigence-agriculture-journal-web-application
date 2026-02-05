import { useEffect, useState } from 'react';

interface LoadingScreenProps {
  progress?: number; // 0-100 for determinate mode
}

export default function LoadingScreen({ progress }: LoadingScreenProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [animationProgress, setAnimationProgress] = useState(0);

  useEffect(() => {
    if (progress !== undefined) {
      // Determinate mode: use provided progress
      setAnimationProgress(progress);
      if (progress >= 100) {
        const timer = setTimeout(() => setIsLoading(false), 500);
        return () => clearTimeout(timer);
      }
    } else {
      // Indeterminate mode: time-based animation
      const duration = 5000; // 5 seconds
      const startTime = Date.now();
      
      const interval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const newProgress = Math.min((elapsed / duration) * 100, 100);
        setAnimationProgress(newProgress);
        
        if (newProgress >= 100) {
          clearInterval(interval);
          setTimeout(() => setIsLoading(false), 500);
        }
      }, 16); // ~60fps

      return () => clearInterval(interval);
    }
  }, [progress]);

  if (!isLoading) return null;

  // Calculate animation stages based on progress
  const seedShake = animationProgress >= 0 && animationProgress <= 20;
  const rootsGrow = animationProgress > 20 && animationProgress <= 40;
  const shootBreaks = animationProgress > 40 && animationProgress <= 60;
  const leavesOpen = animationProgress > 60 && animationProgress <= 80;
  const plantIdle = animationProgress > 80;

  // Calculate specific values for smooth transitions
  const seedOpacity = Math.min(1, animationProgress / 10);
  const seedShakeAmount = seedShake ? Math.sin(animationProgress * 0.5) * 2 : 0;
  
  const rootsLength = rootsGrow ? ((animationProgress - 20) / 20) * 30 : animationProgress > 40 ? 30 : 0;
  
  const shootHeight = shootBreaks ? ((animationProgress - 40) / 20) * 50 : animationProgress > 60 ? 50 : 0;
  const shootOpacity = shootBreaks ? (animationProgress - 40) / 20 : animationProgress > 60 ? 1 : 0;
  
  const leafScale = leavesOpen ? (animationProgress - 60) / 20 : animationProgress > 80 ? 1 : 0;
  const leafOpacity = leavesOpen ? (animationProgress - 60) / 20 : animationProgress > 80 ? 1 : 0;
  
  const leafSway = plantIdle ? Math.sin((animationProgress - 80) * 0.3) * 2 : 0;

  return (
    <div 
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center"
      style={{
        background: 'linear-gradient(to bottom, #F1F8E9 0%, #FFFFFF 100%)'
      }}
    >
      {/* SVG Animation Container */}
      <div className="relative w-full max-w-md h-96 flex items-end justify-center px-8">
        <svg
          viewBox="0 0 400 400"
          className="w-full h-full"
          style={{ maxWidth: '512px', maxHeight: '512px' }}
        >
          {/* Soil Strip (bottom 15%) */}
          <rect
            x="0"
            y="340"
            width="400"
            height="60"
            fill="#6B4F2A"
            opacity={Math.min(1, animationProgress / 10)}
          />

          {/* Seed (visible 0-40%, under soil) */}
          {animationProgress <= 40 && (
            <ellipse
              cx="200"
              cy="330"
              rx="6"
              ry="8"
              fill="#8B6F47"
              opacity={seedOpacity}
              transform={`translate(${seedShakeAmount}, 0)`}
            />
          )}

          {/* Roots (grow 20-40%) */}
          {rootsLength > 0 && (
            <g opacity={Math.min(1, rootsLength / 15)}>
              {/* Left root */}
              <path
                d={`M 200 330 Q 180 ${330 + rootsLength * 0.5} 170 ${330 + rootsLength}`}
                stroke="#FFFFFF"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
              />
              {/* Right root */}
              <path
                d={`M 200 330 Q 220 ${330 + rootsLength * 0.5} 230 ${330 + rootsLength}`}
                stroke="#FFFFFF"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
              />
              {/* Center root */}
              <path
                d={`M 200 330 L 200 ${330 + rootsLength * 0.8}`}
                stroke="#FFFFFF"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
              />
            </g>
          )}

          {/* Shoot/Stem (breaks soil 40-60%, continues growing) */}
          {shootHeight > 0 && (
            <g opacity={shootOpacity}>
              <rect
                x="196"
                y={340 - shootHeight}
                width="8"
                height={shootHeight}
                fill="#2E7D32"
                rx="2"
              />
            </g>
          )}

          {/* Leaves (open 60-80%, sway 80-100%) */}
          {leafScale > 0 && (
            <g opacity={leafOpacity}>
              {/* Left leaf */}
              <ellipse
                cx="185"
                cy="305"
                rx="20"
                ry="12"
                fill="#43A047"
                transform={`scale(${leafScale}) rotate(-25 185 305) rotate(${leafSway} 200 305)`}
                style={{ transformOrigin: '200px 305px' }}
              />
              {/* Right leaf */}
              <ellipse
                cx="215"
                cy="305"
                rx="20"
                ry="12"
                fill="#43A047"
                transform={`scale(${leafScale}) rotate(25 215 305) rotate(${-leafSway} 200 305)`}
                style={{ transformOrigin: '200px 305px' }}
              />
            </g>
          )}

          {/* Additional leaves for fuller plant (appear at 70%+) */}
          {animationProgress > 70 && (
            <g opacity={Math.min(1, (animationProgress - 70) / 10)}>
              {/* Upper left leaf */}
              <ellipse
                cx="188"
                cy="295"
                rx="16"
                ry="10"
                fill="#43A047"
                transform={`rotate(-30 188 295) rotate(${leafSway * 0.8} 200 295)`}
                style={{ transformOrigin: '200px 295px' }}
              />
              {/* Upper right leaf */}
              <ellipse
                cx="212"
                cy="295"
                rx="16"
                ry="10"
                fill="#43A047"
                transform={`rotate(30 212 295) rotate(${-leafSway * 0.8} 200 295)`}
                style={{ transformOrigin: '200px 295px' }}
              />
            </g>
          )}
        </svg>
      </div>

      {/* Loading Text */}
      <div className="mt-8 text-center px-4">
        <p 
          className="text-base font-medium transition-opacity duration-500"
          style={{ 
            color: '#2E7D32',
            opacity: Math.min(1, animationProgress / 30)
          }}
        >
          Cultivating agricultural knowledge…
        </p>
      </div>
    </div>
  );
}
