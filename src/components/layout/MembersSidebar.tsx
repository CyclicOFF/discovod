import React from 'react';
import { cn } from '../../lib/utils';
import { useAppStore } from '../../store/useAppStore';

const MOCK_MEMBERS = [
  {
    category: 'Создатели',
    count: 1,
    members: [
      { id: '1', name: 'Scher', color: '#4ade80', status: 'online', activity: 'Пишет код на React' }
    ]
  },
  {
    category: 'В сети',
    count: 2,
    members: [
      { id: '2', name: 'RustBro', color: '#f87171', status: 'dnd', activity: 'Пишет бэкенд на Rust' },
      { id: '3', name: 'RandomDude', color: '#e3e5e8', status: 'idle' }
    ]
  },
  {
    category: 'Не в сети',
    count: 1,
    members: [
      { id: '4', name: 'OfflineUser', color: '#80848e', status: 'offline' }
    ]
  }
];

function StatusIcon({ status, isHovered }: { status: string, isHovered: boolean }) {
  const bgColor = isHovered ? "#35373c" : "#2b2d31";
  
  if (status === 'online') {
    return (
      <svg width="16" height="16" viewBox="0 0 16 16" className="absolute -bottom-1 -right-1">
        <circle cx="8" cy="8" r="8" fill={bgColor} />
        <circle cx="8" cy="8" r="5" fill="#23a559" />
      </svg>
    );
  }
  if (status === 'idle') {
    return (
      <svg width="16" height="16" viewBox="0 0 16 16" className="absolute -bottom-1 -right-1">
        <circle cx="8" cy="8" r="8" fill={bgColor} />
        <path d="M8 3a5 5 0 1 0 5 5 3.5 3.5 0 0 1-5-5z" fill="#f0b232" />
      </svg>
    );
  }
  if (status === 'dnd') {
    return (
      <svg width="16" height="16" viewBox="0 0 16 16" className="absolute -bottom-1 -right-1">
        <circle cx="8" cy="8" r="8" fill={bgColor} />
        <circle cx="8" cy="8" r="5" fill="#f23f43" />
        <rect x="4.5" y="7" width="7" height="2" rx="1" fill={bgColor} />
      </svg>
    );
  }
  return null;
}

export function MembersSidebar() {
  const { activeServerId, setUserPopout } = useAppStore();
  
  if (activeServerId === 'home') return null;

  return (
    <div className="w-[240px] bg-discord-gray-700 flex-shrink-0 hidden lg:flex flex-col">
      <div className="p-4 pt-6 flex-1 overflow-y-auto scrollbar-thin">
        
        {MOCK_MEMBERS.map((group) => (
          <div key={group.category} className="mb-6">
            <div className="text-[12px] font-bold text-discord-gray-400 uppercase tracking-wider mb-1 pl-2">
              {group.category} — {group.count}
            </div>
            
            {group.members.map((member) => (
              <div 
                key={member.id} 
                onClick={(e) => {
                  e.stopPropagation();
                  setUserPopout({ rect: e.currentTarget.getBoundingClientRect(), member, position: 'left' });
                }}
                className={cn(
                  "flex items-center gap-3 px-2 py-1.5 rounded hover:bg-[#35373c] cursor-pointer transition-colors group",
                  member.status === 'offline' ? "opacity-50 hover:opacity-100" : ""
                )}
              >
                <div className="w-8 h-8 rounded-full bg-discord-blue relative flex-shrink-0 flex items-center justify-center text-white font-medium text-sm">
                  {member.name.charAt(0)}
                  
                  {member.status !== 'offline' && (
                     <>
                       {/* SVG handles the background matching natively */}
                       <div className="hidden group-hover:block">
                         <StatusIcon status={member.status} isHovered={true} />
                       </div>
                       <div className="block group-hover:hidden">
                         <StatusIcon status={member.status} isHovered={false} />
                       </div>
                     </>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate leading-tight text-[15px]" style={{ color: member.color }}>
                    {member.name}
                  </div>
                  {member.activity && (
                    <div className="text-[11px] text-discord-gray-300 truncate leading-tight mt-0.5">
                      {member.activity}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ))}
        
      </div>
    </div>
  );
}
