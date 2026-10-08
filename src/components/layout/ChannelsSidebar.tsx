import React from 'react';
import { useAppStore, CHANNELS_BY_SERVER } from '../../store/useAppStore';
import { cn } from '../../lib/utils';
import { Hash, Volume2, Settings, Mic, Headphones, MicOff } from 'lucide-react';

export function ChannelsSidebar() {
  const { activeChannelId, setActiveChannel, activeServerId } = useAppStore();
  const isHome = activeServerId === 'home';

  if (isHome) {
    return (
      <div className="w-[240px] bg-discord-gray-700 flex flex-col flex-shrink-0 rounded-tl-lg">
        <div className="h-12 border-b border-discord-gray-900/50 flex items-center px-4 shadow-sm">
           <input type="text" placeholder="Найти или начать беседу" className="w-full bg-discord-gray-900 text-sm text-gray-200 px-2 py-1 rounded border-none outline-none" />
        </div>
        <div className="flex-1 p-4 text-discord-gray-400 font-medium">
           Личные сообщения
        </div>
        <UserPanel />
      </div>
    );
  }

  const serverName = activeServerId === 'server-1' ? 'Дисковод Сервер' : 'Rust Developers';
  const channels = activeServerId ? CHANNELS_BY_SERVER[activeServerId] || [] : [];
  
  const textChannels = channels.filter(c => c.type === 'text');
  const voiceChannels = channels.filter(c => c.type === 'voice');

  return (
    <div className="w-[240px] bg-discord-gray-700 flex flex-col flex-shrink-0 rounded-tl-lg">
      {/* Server Header */}
      <div className="h-12 border-b border-discord-gray-900/50 flex items-center px-4 font-bold shadow-sm cursor-pointer hover:bg-discord-gray-600/50 transition-colors">
        {serverName}
      </div>
      
      {/* Channels List */}
      <div className="flex-1 overflow-y-auto p-2 scrollbar-thin">
        {textChannels.length > 0 && (
          <div className="text-xs font-bold text-discord-gray-400 hover:text-gray-300 cursor-pointer uppercase tracking-wider mb-1 px-2 pt-4 flex items-center">
            Текстовые каналы
          </div>
        )}
        
        {textChannels.map(channel => (
          <ChannelItem 
            key={channel.id}
            id={channel.id} 
            name={channel.name} 
            type={channel.type} 
            isActive={activeChannelId === channel.id} 
            onClick={() => setActiveChannel(channel.id)} 
          />
        ))}
        
        {voiceChannels.length > 0 && (
          <div className="text-xs font-bold text-discord-gray-400 hover:text-gray-300 cursor-pointer uppercase tracking-wider mb-1 px-2 pt-4 flex items-center mt-2">
            Голосовые каналы
          </div>
        )}
        
        {voiceChannels.map(channel => (
          <ChannelItem 
            key={channel.id}
            id={channel.id} 
            name={channel.name} 
            type={channel.type} 
            isActive={activeChannelId === channel.id} 
            onClick={() => setActiveChannel(channel.id)} 
          />
        ))}
      </div>

      <UserPanel />
    </div>
  );
}

function ChannelItem({ id, name, type, isActive, onClick }: { id: string, name: string, type: 'text' | 'voice', isActive: boolean, onClick: () => void }) {
  return (
    <div 
      onClick={onClick}
      className={cn(
        "px-2 py-1.5 rounded-md cursor-pointer flex items-center gap-1.5 mb-0.5 group transition-colors",
        isActive 
          ? "bg-discord-gray-500/60 text-gray-100" 
          : "text-discord-gray-400 hover:bg-discord-gray-600/50 hover:text-gray-300"
      )}
    >
      {type === 'text' ? (
        <Hash className="w-5 h-5 text-discord-gray-400" />
      ) : (
        <Volume2 className="w-5 h-5 text-discord-gray-400" />
      )}
      <span className="font-medium truncate">{name}</span>
    </div>
  );
}

function UserPanel() {
  const { setSettingsOpen, isMuted, isDeafened, toggleMute, toggleDeafen, setUserPopout } = useAppStore();
  return (
    <div className="h-[52px] bg-discord-gray-900/40 flex items-center px-2 gap-2 flex-shrink-0">
      <div 
        onClick={(e) => {
          e.stopPropagation();
          setUserPopout({ 
            rect: e.currentTarget.getBoundingClientRect(), 
            member: { name: 'Scher', status: 'online', activity: 'Пишет клон Discord 🚀' },
            position: 'right'
          });
        }}
        className="flex items-center gap-2 flex-1 min-w-0 hover:bg-discord-gray-600/50 p-1 rounded-md cursor-pointer"
      >
        <div className="w-8 h-8 rounded-full bg-discord-blue relative flex-shrink-0">
           <svg width="16" height="16" viewBox="0 0 16 16" className="absolute -bottom-1 -right-1 group-hover:hidden">
             <circle cx="8" cy="8" r="8" fill="#1e1f22" />
             <circle cx="8" cy="8" r="5" fill="#23a559" />
           </svg>
           <svg width="16" height="16" viewBox="0 0 16 16" className="absolute -bottom-1 -right-1 hidden group-hover:block">
             <circle cx="8" cy="8" r="8" fill="#3f4147" />
             <circle cx="8" cy="8" r="5" fill="#23a559" />
           </svg>
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-bold truncate leading-tight">Scher</div>
          <div className="text-[11px] text-discord-gray-400 truncate leading-tight">В сети</div>
        </div>
      </div>
      
      <div className="flex items-center gap-0.5 text-discord-gray-400">
        <button 
          onClick={toggleMute}
          className="p-1.5 hover:bg-discord-gray-600/50 hover:text-gray-200 rounded-md transition-colors relative"
        >
          {isMuted ? <MicOff className="w-4 h-4 text-red-400" /> : <Mic className="w-4 h-4" />}
        </button>
        <button 
          onClick={toggleDeafen}
          className="p-1.5 hover:bg-discord-gray-600/50 hover:text-gray-200 rounded-md transition-colors relative"
        >
          <Headphones className={cn("w-4 h-4", isDeafened && "text-red-400")} />
          {isDeafened && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-[18px] h-[2px] bg-[#2b2d31] absolute transform -rotate-45"></div>
              <div className="w-[16px] h-[2px] bg-red-400 absolute transform -rotate-45"></div>
            </div>
          )}
        </button>
        <button onClick={() => setSettingsOpen(true)} className="p-1.5 hover:bg-discord-gray-600/50 hover:text-gray-200 rounded-md transition-colors">
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
