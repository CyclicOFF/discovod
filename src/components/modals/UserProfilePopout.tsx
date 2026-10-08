import React, { useEffect, useRef } from 'react';
import { useAppStore } from '../../store/useAppStore';

export function UserProfilePopout() {
  const { userPopout, setUserPopout } = useAppStore();
  const popoutRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!userPopout) return;
    const handleClick = (e: MouseEvent) => {
      if (popoutRef.current && !popoutRef.current.contains(e.target as Node)) {
        setUserPopout(null);
      }
    };
    // Use timeout to prevent immediate closing on the same click that opened it
    setTimeout(() => window.addEventListener('click', handleClick), 0);
    return () => window.removeEventListener('click', handleClick);
  }, [userPopout, setUserPopout]);

  if (!userPopout) return null;
  const { rect, member, position } = userPopout;

  const width = 340;
  const height = 400; // estimated height

  let finalX = 0;
  let finalY = 0;

  if (position === 'left') {
    finalX = rect.left - width - 16;
    finalY = rect.top;
  } else if (position === 'right') {
    finalX = rect.right + 16;
    finalY = rect.top;
  } else {
    // top
    finalX = rect.left;
    finalY = rect.top - height - 16;
  }

  // Clamping to screen boundaries
  if (finalY + height > window.innerHeight) {
    finalY = window.innerHeight - height - 16;
  }
  if (finalY < 16) finalY = 16;
  
  if (finalX + width > window.innerWidth) {
    finalX = window.innerWidth - width - 16;
  }
  if (finalX < 16) finalX = 16;

  return (
    <div 
      ref={popoutRef}
      className="fixed z-[150] w-[340px] bg-[#111214] rounded-lg shadow-2xl border border-discord-gray-700/50 overflow-hidden animate-in fade-in zoom-in-95 duration-100"
      style={{ left: finalX, top: finalY }}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Banner */}
      <div className="h-[60px] bg-discord-blue relative">
        <div className="absolute -bottom-10 left-4 w-[80px] h-[80px] rounded-full border-[6px] border-[#111214] bg-discord-blue flex items-center justify-center text-3xl font-bold text-white shadow-sm">
          {member.name.charAt(0)}
          {member.status !== 'offline' && (
            <div className="absolute bottom-0 right-0 w-5 h-5 rounded-full border-4 border-[#111214] bg-green-500"></div>
          )}
        </div>
      </div>
      
      {/* Container below banner */}
      <div className="px-4 pb-4 pt-12">
        <div className="font-bold text-white text-xl leading-tight">{member.name}</div>
        <div className="text-sm text-discord-gray-200 mb-3">{member.name.toLowerCase()}#1234</div>
        
        <div className="w-full h-[1px] bg-discord-gray-700/50 my-3"></div>
        
        {/* Dark inner container for content */}
        <div className="bg-[#1e1f22] p-3 rounded-lg border border-[#2b2d31]">
          <div className="text-xs font-bold text-discord-gray-400 uppercase mb-1">Обо мне</div>
          <div className="text-sm text-gray-300 whitespace-pre-wrap mb-4">
            {member.activity || 'Люблю кодить на React! 🚀'}
          </div>
          
          <input 
            type="text" 
            placeholder={`Написать @${member.name}`}
            className="w-full bg-[#111214] text-sm text-gray-200 p-2.5 rounded border border-discord-gray-900/50 outline-none focus:border-discord-gray-500 transition-colors"
          />
        </div>
      </div>
    </div>
  );
}
