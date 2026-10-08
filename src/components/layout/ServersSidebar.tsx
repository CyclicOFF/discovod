import React from 'react';
import { useAppStore } from '../../store/useAppStore';
import { cn } from '../../lib/utils';

interface ServerIconProps {
  id: string;
  name: string;
  icon?: string;
  isHome?: boolean;
}

function ServerIcon({ id, name, icon, isHome }: ServerIconProps) {
  const { activeServerId, setActiveServer } = useAppStore();
  const isActive = activeServerId === id;

  return (
    <div className="relative flex items-center justify-center w-full group mb-2">
      {/* Pill Indicator (left side) */}
      <div 
        className={cn(
          "absolute left-0 w-1 bg-white rounded-r-md transition-all duration-300 origin-left",
          isActive ? "h-[40px] opacity-100" : "h-[20px] opacity-0 scale-0 group-hover:opacity-100 group-hover:scale-100"
        )}
      ></div>
      
      {/* Icon Shape (Circle to Squircle) */}
      <div 
        onClick={() => setActiveServer(id)}
        className={cn(
          "w-12 h-12 rounded-[16px] flex items-center justify-center transition-all duration-300 cursor-pointer overflow-hidden text-lg font-medium",
          isActive 
            ? "bg-discord-blue text-white" 
            : "bg-discord-gray-600 text-gray-100 group-hover:bg-discord-blue group-hover:text-white"
        )}
      >
        {icon ? (
          <img src={icon} alt={name} className="w-full h-full object-cover" />
        ) : (
          <span>{isHome ? 'D' : name.charAt(0)}</span>
        )}
      </div>
    </div>
  );
}

export function ServersSidebar() {
  return (
    <div className="w-[72px] bg-discord-gray-800 flex flex-col items-center py-3 flex-shrink-0">
      <ServerIcon id="home" name="Home" isHome={true} />
      
      <div className="w-8 h-[2px] bg-discord-gray-700 rounded-lg mb-2"></div>
      
      <ServerIcon id="server-1" name="Дисковод" />
      <ServerIcon id="server-2" name="Rust" />
      
      <div className="w-12 h-12 mt-2 bg-discord-gray-600 rounded-[16px] hover:bg-green-500 text-green-500 hover:text-white transition-all duration-300 cursor-pointer flex items-center justify-center">
        <span className="text-2xl leading-none font-light">+</span>
      </div>
    </div>
  );
}
