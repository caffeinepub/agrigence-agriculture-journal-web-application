import { useEffect, useState } from 'react';

export default function LoadingScreen() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Animation duration: 3 seconds total
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gradient-to-b from-sky-100 via-sky-50 to-amber-50 dark:from-slate-900 dark:via-slate-800 dark:to-stone-900">
      <div className="relative w-64 h-64 flex items-end justify-center">
        {/* Soil layer - appears first */}
        <div className="absolute bottom-0 w-full h-20 bg-gradient-to-b from-amber-800 to-amber-900 dark:from-stone-800 dark:to-stone-900 rounded-t-3xl soil-appear" />
        
        {/* Seed - drops into soil */}
        <div className="absolute bottom-16 w-3 h-3 bg-amber-700 dark:bg-amber-600 rounded-full seed-drop" />
        
        {/* Sprout container */}
        <div className="absolute bottom-20 flex flex-col items-center sprout-grow">
          {/* Stem */}
          <div className="w-1 bg-gradient-to-t from-green-700 to-green-500 dark:from-green-600 dark:to-green-400 stem-height" />
          
          {/* Leaves */}
          <div className="relative">
            {/* Left leaf */}
            <div className="absolute -left-4 top-0 w-6 h-3 bg-gradient-to-br from-green-500 to-green-600 dark:from-green-400 dark:to-green-500 rounded-full origin-right leaf-left" />
            
            {/* Right leaf */}
            <div className="absolute -right-4 top-0 w-6 h-3 bg-gradient-to-bl from-green-500 to-green-600 dark:from-green-400 dark:to-green-500 rounded-full origin-left leaf-right" />
            
            {/* Top leaves */}
            <div className="absolute -left-3 -top-4 w-5 h-3 bg-gradient-to-br from-green-400 to-green-500 dark:from-green-300 dark:to-green-400 rounded-full origin-bottom-right leaf-top-left" />
            <div className="absolute -right-3 -top-4 w-5 h-3 bg-gradient-to-bl from-green-400 to-green-500 dark:from-green-300 dark:to-green-400 rounded-full origin-bottom-left leaf-top-right" />
          </div>
        </div>

        {/* Loading text */}
        <div className="absolute -bottom-12 text-center w-full text-fade-in">
          <p className="text-sm font-medium text-green-800 dark:text-green-300">
            Growing Knowledge Together
          </p>
        </div>
      </div>

      <style>{`
        /* Soil appears first - fade in from bottom */
        @keyframes soilAppear {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .soil-appear {
          animation: soilAppear 0.5s ease-out forwards;
        }

        /* Seed drops into soil */
        @keyframes seedDrop {
          0% {
            opacity: 0;
            transform: translateY(-100px);
          }
          50% {
            opacity: 1;
          }
          100% {
            opacity: 0;
            transform: translateY(0);
          }
        }

        .seed-drop {
          animation: seedDrop 0.6s ease-in 0.5s forwards;
        }

        /* Sprout emerges and grows */
        @keyframes sproutGrow {
          0% {
            opacity: 0;
            transform: translateY(20px) scale(0.5);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .sprout-grow {
          animation: sproutGrow 0.8s ease-out 1.1s forwards;
          opacity: 0;
        }

        /* Stem grows upward */
        @keyframes stemGrow {
          0% {
            height: 0;
          }
          100% {
            height: 40px;
          }
        }

        .stem-height {
          animation: stemGrow 0.8s ease-out 1.1s forwards;
          height: 0;
        }

        /* Left leaf unfolds */
        @keyframes leafLeftUnfold {
          0% {
            transform: rotate(90deg) scale(0);
            opacity: 0;
          }
          100% {
            transform: rotate(-20deg) scale(1);
            opacity: 1;
          }
        }

        .leaf-left {
          animation: leafLeftUnfold 0.5s ease-out 1.9s forwards;
          opacity: 0;
        }

        /* Right leaf unfolds */
        @keyframes leafRightUnfold {
          0% {
            transform: rotate(-90deg) scale(0);
            opacity: 0;
          }
          100% {
            transform: rotate(20deg) scale(1);
            opacity: 1;
          }
        }

        .leaf-right {
          animation: leafRightUnfold 0.5s ease-out 1.9s forwards;
          opacity: 0;
        }

        /* Top left leaf unfolds */
        @keyframes leafTopLeftUnfold {
          0% {
            transform: rotate(90deg) scale(0);
            opacity: 0;
          }
          100% {
            transform: rotate(-30deg) scale(1);
            opacity: 1;
          }
        }

        .leaf-top-left {
          animation: leafTopLeftUnfold 0.4s ease-out 2.2s forwards;
          opacity: 0;
        }

        /* Top right leaf unfolds */
        @keyframes leafTopRightUnfold {
          0% {
            transform: rotate(-90deg) scale(0);
            opacity: 0;
          }
          100% {
            transform: rotate(30deg) scale(1);
            opacity: 1;
          }
        }

        .leaf-top-right {
          animation: leafTopRightUnfold 0.4s ease-out 2.2s forwards;
          opacity: 0;
        }

        /* Text fades in at the end */
        @keyframes textFadeIn {
          0% {
            opacity: 0;
            transform: translateY(10px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .text-fade-in {
          animation: textFadeIn 0.5s ease-out 2.4s forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
}
