import React from 'react';
import { cn } from '../../lib/utils';
import { useAppStore } from '../../store/useAppStore';

export interface MessageProps {
  id: string;
  author: {
    name: string;
    avatarUrl?: string;
    color?: string; // Like role colors in Discord
  };
  content: string;
  timestamp: string;
  isGroupStart?: boolean; // if true, shows avatar and name header
  onContextMenu?: (e: React.MouseEvent, id: string) => void;
}

export function MessageItem({ id, author, content, timestamp, isGroupStart = true, onContextMenu }: MessageProps) {
  const { setUserPopout } = useAppStore();
  return (
    <div 
      onContextMenu={(e) => onContextMenu && onContextMenu(e, id)}
      className={cn(
        "flex hover:bg-discord-gray-900/40 px-4 py-0.5 group",
        isGroupStart ? "mt-[17px]" : ""
      )}
    >
      {/* Avatar or compact timestamp column */}
      <div className="w-[56px] flex-shrink-0 flex justify-start">
        {isGroupStart ? (
          <div 
            onClick={(e) => {
              e.stopPropagation();
              setUserPopout({ 
                rect: e.currentTarget.getBoundingClientRect(), 
                member: { name: author.name, status: 'online', activity: 'Пишет сообщения в чате' },
                position: 'right'
              });
            }}
            className="w-10 h-10 rounded-full bg-discord-blue overflow-hidden cursor-pointer mt-0.5 relative"
          >
            {author.avatarUrl ? (
              <img src={author.avatarUrl} alt={author.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center font-bold text-white">
                {author.name.charAt(0)}
              </div>
            )}
          </div>
        ) : (
          <div className="w-10 text-[11px] text-discord-gray-400 opacity-0 group-hover:opacity-100 flex items-center justify-end h-[1.375rem] pr-1">
            {timestamp.split(' ')[0]} {/* simplified compact time */}
          </div>
        )}
      </div>
      
      {/* Message Content */}
      <div className="flex-1 min-w-0 pb-1 -ml-1">
        {isGroupStart && (
          <div className="flex items-baseline gap-2 mb-1">
            <span 
              className="font-medium hover:underline cursor-pointer"
              style={{ color: author.color || '#fff' }}
            >
              {author.name}
            </span>
            <span className="text-xs text-discord-gray-400 font-medium">{timestamp}</span>
          </div>
        )}
        <div className="text-gray-200 text-[15px] leading-[1.375rem] whitespace-pre-wrap break-words">
          {content}
        </div>
      </div>
    </div>
  );
}
