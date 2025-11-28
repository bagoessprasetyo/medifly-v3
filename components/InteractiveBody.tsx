
import React, { useState } from 'react';
import { Scan, Activity, Zap, Target, MousePointer2 } from 'lucide-react';

interface InteractiveBodyProps {
  onSelectPart: (part: string) => void;
}

interface BodyPartPath {
  id: string;
  label: string;
  d: string; // SVG Path data
  cx: number; // Center X for targeting
  cy: number; // Center Y for targeting
}

// Detailed anatomical paths for a "Mannequin" style display
const BODY_PARTS: BodyPartPath[] = [
  // HEAD & NECK
  { 
    id: 'head', label: 'Head & Brain', 
    d: "M100,10 C115,10 125,20 125,40 C125,55 115,65 100,65 C85,65 75,55 75,40 C75,20 85,10 100,10 Z",
    cx: 100, cy: 35
  },
  { 
    id: 'neck', label: 'Neck & Throat', 
    d: "M88,62 C88,62 112,62 112,62 C115,75 120,78 125,82 L75,82 C80,78 85,75 88,62 Z",
    cx: 100, cy: 72
  },

  // TORSO
  { 
    id: 'chest', label: 'Chest (Heart/Lungs)', 
    d: "M75,82 L125,82 C135,82 142,90 140,115 C138,135 135,140 135,140 L65,140 C65,140 62,135 60,115 C58,90 65,82 75,82 Z",
    cx: 100, cy: 110
  },
  { 
    id: 'abdomen_upper', label: 'Upper Abdomen', 
    d: "M65,142 L135,142 C135,142 132,170 130,175 L70,175 C68,170 65,142 65,142 Z",
    cx: 100, cy: 158
  },
  { 
    id: 'abdomen_lower', label: 'Lower Abdomen / Pelvis', 
    d: "M70,177 L130,177 C130,177 132,195 140,210 L100,225 L60,210 C68,195 70,177 70,177 Z",
    cx: 100, cy: 195
  },

  // SHOULDERS
  { 
    id: 'shoulder_l', label: 'Left Shoulder', 
    d: "M60,85 C50,85 40,90 35,100 L45,110 C50,100 55,95 62,95 Z",
    cx: 48, cy: 95
  },
  { 
    id: 'shoulder_r', label: 'Right Shoulder', 
    d: "M140,85 C150,85 160,90 165,100 L155,110 C150,100 145,95 138,95 Z",
    cx: 152, cy: 95
  },

  // ARMS (Left)
  { 
    id: 'arm_upper_l', label: 'Left Upper Arm', 
    d: "M35,102 L45,112 L40,145 L30,140 Z",
    cx: 37, cy: 125
  },
  { 
    id: 'elbow_l', label: 'Left Elbow', 
    d: "M30,142 L40,147 L38,155 L28,150 Z",
    cx: 34, cy: 148
  },
  { 
    id: 'arm_lower_l', label: 'Left Forearm', 
    d: "M28,152 L38,157 L32,190 L20,185 Z",
    cx: 29, cy: 170
  },
  { 
    id: 'hand_l', label: 'Left Hand', 
    d: "M20,187 L32,192 C32,192 30,210 15,205 C15,205 10,195 20,187 Z",
    cx: 22, cy: 198
  },

  // ARMS (Right)
  { 
    id: 'arm_upper_r', label: 'Right Upper Arm', 
    d: "M165,102 L155,112 L160,145 L170,140 Z",
    cx: 163, cy: 125
  },
  { 
    id: 'elbow_r', label: 'Right Elbow', 
    d: "M170,142 L160,147 L162,155 L172,150 Z",
    cx: 166, cy: 148
  },
  { 
    id: 'arm_lower_r', label: 'Right Forearm', 
    d: "M172,152 L162,157 L168,190 L180,185 Z",
    cx: 171, cy: 170
  },
  { 
    id: 'hand_r', label: 'Right Hand', 
    d: "M180,187 L168,192 C168,192 170,210 185,205 C185,205 190,195 180,187 Z",
    cx: 178, cy: 198
  },

  // LEGS (Left)
  { 
    id: 'thigh_l', label: 'Left Thigh', 
    d: "M100,225 L60,210 C58,220 55,260 65,280 L95,280 C98,250 100,225 100,225 Z",
    cx: 80, cy: 250
  },
  { 
    id: 'knee_l', label: 'Left Knee', 
    d: "M65,282 L95,282 C95,282 94,300 92,305 L68,305 C66,300 65,282 65,282 Z",
    cx: 80, cy: 294
  },
  { 
    id: 'shin_l', label: 'Left Shin/Calf', 
    d: "M68,307 L92,307 C90,330 88,360 85,375 L70,375 C67,360 66,330 68,307 Z",
    cx: 78, cy: 340
  },
  { 
    id: 'foot_l', label: 'Left Foot', 
    d: "M70,377 L85,377 C85,377 90,390 85,395 L55,395 C50,390 60,385 70,377 Z",
    cx: 70, cy: 388
  },

  // LEGS (Right)
  { 
    id: 'thigh_r', label: 'Right Thigh', 
    d: "M100,225 L140,210 C142,220 145,260 135,280 L105,280 C102,250 100,225 100,225 Z",
    cx: 120, cy: 250
  },
  { 
    id: 'knee_r', label: 'Right Knee', 
    d: "M135,282 L105,282 C105,282 106,300 108,305 L132,305 C134,300 135,282 135,282 Z",
    cx: 120, cy: 294
  },
  { 
    id: 'shin_r', label: 'Right Shin/Calf', 
    d: "M132,307 L108,307 C110,330 112,360 115,375 L130,375 C133,360 134,330 132,307 Z",
    cx: 122, cy: 340
  },
  { 
    id: 'foot_r', label: 'Right Foot', 
    d: "M130,377 L115,377 C115,377 110,390 115,395 L145,395 C150,390 140,385 130,377 Z",
    cx: 130, cy: 388
  }
];

export const InteractiveBody: React.FC<InteractiveBodyProps> = ({ onSelectPart }) => {
  const [hoveredPart, setHoveredPart] = useState<string | null>(null);
  const [selectedPart, setSelectedPart] = useState<string | null>(null);

  const handleSelect = (partId: string) => {
    setSelectedPart(partId);
    // Slight delay to show selection effect before triggering
    setTimeout(() => {
        const part = BODY_PARTS.find(p => p.id === partId);
        onSelectPart(part ? part.label : 'Body Part');
        setSelectedPart(null);
    }, 400);
  };

  const activePart = BODY_PARTS.find(p => p.id === hoveredPart);

  return (
    <div className="relative w-[320px] h-[480px] mx-auto animate-in fade-in zoom-in-95 duration-700 select-none">
      
      {/* Background Grid & Decorators */}
      <div className="absolute inset-0 border border-slate-100/50 rounded-3xl bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-slate-50/50 to-slate-100/20 pointer-events-none">
         {/* Vertical Grid Lines */}
         <div className="absolute left-1/4 top-4 bottom-4 w-px bg-indigo-50/50"></div>
         <div className="absolute right-1/4 top-4 bottom-4 w-px bg-indigo-50/50"></div>
         <div className="absolute left-1/2 top-4 bottom-4 w-px bg-indigo-100/50"></div>
         
         {/* Horizontal Grid Lines */}
         <div className="absolute top-1/4 left-4 right-4 h-px bg-indigo-50/50"></div>
         <div className="absolute top-1/2 left-4 right-4 h-px bg-indigo-100/50"></div>
         <div className="absolute top-3/4 left-4 right-4 h-px bg-indigo-50/50"></div>
      </div>

      {/* Scanning Laser Effect */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden rounded-3xl opacity-40">
         <div className="w-full h-[2px] bg-indigo-400 shadow-[0_0_15px_2px_rgba(99,102,241,0.6)] absolute top-0 animate-[scan_4s_ease-in-out_infinite]" />
      </div>

      {/* Tech UI Labels */}
      <div className="absolute -left-16 top-12 flex flex-col gap-2 pointer-events-none opacity-60">
         <div className="flex items-center gap-2 text-[9px] text-indigo-400 font-mono tracking-widest">
            <Scan className="w-3 h-3" /> ANATOMY_SCAN_V2
         </div>
      </div>

      {/* Main SVG Render */}
      <svg viewBox="0 0 200 420" className="w-full h-full drop-shadow-xl overflow-visible relative z-10">
        <defs>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <linearGradient id="mannequinGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#f8fafc" />
            <stop offset="50%" stopColor="#f1f5f9" />
            <stop offset="100%" stopColor="#e2e8f0" />
          </linearGradient>
           <linearGradient id="activeGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#818cf8" />
            <stop offset="100%" stopColor="#4f46e5" />
          </linearGradient>
          <pattern id="gridPattern" width="10" height="10" patternUnits="userSpaceOnUse">
             <path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(99,102,241,0.1)" strokeWidth="0.5"/>
          </pattern>
        </defs>

        {/* Silhouette / Ghost Layer */}
         <path 
          d="M100,10 C125,10 145,30 145,50 C145,65 155,75 175,80 L190,190 L150,380 L140,380 L140,230 L60,230 L60,380 L50,380 L10,190 L25,80 C45,75 55,65 55,50 C55,30 75,10 100,10 Z"
          fill="url(#gridPattern)"
          stroke="rgba(148, 163, 184, 0.2)" 
          strokeWidth="1"
          className="pointer-events-none"
        />

        {/* Interactive Parts */}
        {BODY_PARTS.map((part) => {
            const isHovered = hoveredPart === part.id;
            const isSelected = selectedPart === part.id;

            return (
              <g key={part.id}>
                <path
                    d={part.d}
                    fill={isSelected ? "#4f46e5" : (isHovered ? "url(#activeGradient)" : "white")}
                    stroke={isSelected ? "#4f46e5" : (isHovered ? "#6366f1" : "#cbd5e1")}
                    strokeWidth={isHovered ? "1.5" : "1"}
                    className="transition-all duration-200 cursor-pointer"
                    style={{ 
                        opacity: isHovered ? 0.9 : 0.6,
                        filter: isHovered ? 'url(#glow)' : 'none',
                        transform: isHovered ? 'scale(1.01)' : 'scale(1)',
                        transformBox: 'fill-box',
                        transformOrigin: 'center'
                    }}
                    onMouseEnter={() => setHoveredPart(part.id)}
                    onMouseLeave={() => setHoveredPart(null)}
                    onClick={() => handleSelect(part.id)}
                />
                
                {/* Targeting Reticle (Only when hovered) */}
                {isHovered && (
                   <g pointerEvents="none">
                      <circle cx={part.cx} cy={part.cy} r="4" fill="none" stroke="white" strokeWidth="1.5" className="animate-ping" />
                      <circle cx={part.cx} cy={part.cy} r="2" fill="white" />
                      
                      {/* Connection Line to Label */}
                      <line x1={part.cx} y1={part.cy} x2={part.cx > 100 ? 210 : -10} y2={part.cy} stroke="#6366f1" strokeWidth="1" strokeDasharray="2,2" />
                   </g>
                )}
              </g>
            );
        })}
      </svg>

      {/* Dynamic Hover Label (Targeting UI) */}
      {activePart && (
        <div 
            className="absolute z-20 pointer-events-none flex flex-col items-center"
            style={{ 
                // Position roughly near the part, but utilizing the absolute container
                top: `${(activePart.cy / 420) * 100}%`,
                left: activePart.cx > 100 ? 'auto' : '0',
                right: activePart.cx > 100 ? '0' : 'auto',
                transform: `translateY(-50%) ${activePart.cx > 100 ? 'translateX(10px)' : 'translateX(-10px)'}` 
            }}
        >
            <div className={`
                bg-white/95 backdrop-blur-sm border border-indigo-100 shadow-xl px-4 py-2 rounded-lg 
                flex flex-col gap-0.5 animate-in fade-in zoom-in-95 duration-200
                ${activePart.cx > 100 ? 'items-end text-right' : 'items-start text-left'}
            `}>
                <span className="text-[10px] font-mono text-indigo-400 uppercase tracking-widest flex items-center gap-1">
                   <Target className="w-3 h-3" /> DETECTED
                </span>
                <span className="text-sm font-bold text-slate-800 whitespace-nowrap">
                   {activePart.label}
                </span>
                <div className="flex items-center gap-1 mt-1">
                   <div className="h-1 w-12 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-500 animate-[loading_1s_ease-in-out_infinite] w-full origin-left"></div>
                   </div>
                </div>
            </div>
        </div>
      )}
      
      {/* Bottom Instructions */}
      <div className="absolute bottom-2 left-0 right-0 text-center pointer-events-none">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/80 backdrop-blur-md rounded-full border border-slate-200 shadow-sm text-xs font-medium text-slate-500">
              <MousePointer2 className="w-3.5 h-3.5 text-indigo-500" />
              Select specific area for diagnosis
          </div>
      </div>

      <style>{`
        @keyframes scan {
            0% { top: 0%; opacity: 0; }
            15% { opacity: 1; }
            85% { opacity: 1; }
            100% { top: 100%; opacity: 0; }
        }
        @keyframes loading {
            0% { transform: scaleX(0); }
            50% { transform: scaleX(1); }
            100% { transform: scaleX(0); transform-origin: right; }
        }
      `}</style>
    </div>
  );
};
