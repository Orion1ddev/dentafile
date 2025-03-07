
import { useRef } from 'react';

export const BackgroundEffect = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={containerRef} className="fixed inset-0 pointer-events-none z-[-1]">
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        version="1.1" 
        xmlnsXlink="http://www.w3.org/1999/xlink"
        width="100%" 
        height="100%"
        preserveAspectRatio="none" 
        viewBox="0 0 1920 1000"
        className="w-full h-full"
      >
        <g mask="url(#SvgjsMask1026)" fill="none">
          <rect width="1920" height="1000" x="0" y="0" fill="url(#SvgjsLinearGradient1027)"></rect>
          <path d="M1920 0L996.49 0L1920 271.72z" fill="rgba(255, 255, 255, .1)"></path>
          <path d="M996.49 0L1920 271.72L1920 451.33000000000004L805.2 0z" fill="rgba(255, 255, 255, .075)"></path>
          <path d="M805.2 0L1920 451.33000000000004L1920 789.07L773.3000000000001 0z" fill="rgba(255, 255, 255, .05)"></path>
          <path d="M773.3 0L1920 789.07L1920 849.0500000000001L248.92999999999995 0z" fill="rgba(255, 255, 255, .025)"></path>
          <path d="M0 1000L602.01 1000L0 838.37z" fill="rgba(0, 0, 0, .1)"></path>
          <path d="M0 838.37L602.01 1000L1173.77 1000L0 657.21z" fill="rgba(0, 0, 0, .075)"></path>
          <path d="M0 657.21L1173.77 1000L1568.02 1000L0 522.1700000000001z" fill="rgba(0, 0, 0, .05)"></path>
          <path d="M0 522.1700000000001L1568.02 1000L1600.68 1000L0 239.3400000000001z" fill="rgba(0, 0, 0, .025)"></path>
        </g>
        <defs>
          <mask id="SvgjsMask1026">
            <rect width="1920" height="1000" fill="#ffffff"></rect>
          </mask>
          <linearGradient x1="11.98%" y1="-23%" x2="88.02%" y2="123%" gradientUnits="userSpaceOnUse" id="SvgjsLinearGradient1027">
            <stop stopColor="#0e2a47" offset="0"></stop>
            <stop stopColor="#00459e" offset="1"></stop>
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};
