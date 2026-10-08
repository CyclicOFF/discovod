import React, { useState, useRef, useEffect } from 'react';
import { useAppStore, CHANNELS_BY_SERVER } from '../../store/useAppStore';
import { Hash, Bell, Pin, Users, Search, HelpCircle, Plus, Copy, MessageSquareReply, Trash2, Pencil } from 'lucide-react';
import { MessageItem } from '../chat/MessageItem';
import { DateDivider } from '../chat/DateDivider';
import { socketClient } from '../../lib/socket';

export function ChatArea() {
  const { activeChannelId, activeServerId, messagesByChannel, addMessage, deleteMessage } = useAppStore();
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [contextMenu, setContextMenu] = useState<{ x: number, y: number, messageId: string } | null>(null);
  
  const messages = activeChannelId && messagesByChannel[activeChannelId] ? messagesByChannel[activeChannelId] : [];

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle clicking outside to close context menu
  useEffect(() => {
    const handleClick = () => setContextMenu(null);
    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, []);

  if (activeServerId === 'home') {
     return <div className="flex-1 bg-discord-gray-600 flex items-center justify-center text-discord-gray-400 text-lg font-medium">Выберите друга для чата</div>
  }

  const serverChannels = activeServerId && activeServerId !== 'home' ? Object.values(CHANNELS_BY_SERVER).flat() : [];
  const currentChannel = serverChannels.find(c => c.id === activeChannelId);
  const channelName = currentChannel ? currentChannel.name : 'Канал';

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim() && activeChannelId) {
      const text = inputValue.trim();
      addMessage(activeChannelId, text);
      socketClient.sendMessage(activeChannelId, text);
      setInputValue('');
    }
  };

  const handleContextMenu = (e: React.MouseEvent, id: string) => {
    e.preventDefault(); // Prevent default browser context menu
    
    // Make sure menu doesn't go off-screen at the bottom right
    const menuWidth = 200;
    const menuHeight = 150;
    let x = e.clientX;
    let y = e.clientY;
    
    if (x + menuWidth > window.innerWidth) x = window.innerWidth - menuWidth - 10;
    if (y + menuHeight > window.innerHeight) y = window.innerHeight - menuHeight - 10;
    
    setContextMenu({ x, y, messageId: id });
  };

  const copyMessageText = () => {
    if (!contextMenu) return;
    const msg = messages.find(m => m.id === contextMenu.messageId);
    if (msg && msg.content) {
      navigator.clipboard.writeText(msg.content);
    }
  };

  const handleDelete = () => {
    if (!contextMenu || !activeChannelId) return;
    deleteMessage(activeChannelId, contextMenu.messageId);
  };

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-discord-gray-600 relative">
      {/* Header */}
      <div className="h-12 border-b border-discord-gray-900/50 flex items-center justify-between px-4 shadow-sm flex-shrink-0 z-10 bg-discord-gray-600">
        <div className="flex items-center gap-2">
          <Hash className="w-6 h-6 text-discord-gray-400" />
          <span className="font-bold text-gray-100">{channelName}</span>
        </div>
        
        <div className="flex items-center gap-4 text-discord-gray-400">
          <Bell className="w-5 h-5 hover:text-gray-200 cursor-pointer transition-colors" />
          <Pin className="w-5 h-5 hover:text-gray-200 cursor-pointer transition-colors" />
          <Users className="w-5 h-5 hover:text-gray-200 cursor-pointer transition-colors" />
          <div className="bg-discord-gray-900/50 text-sm px-2 py-1 rounded w-36 flex items-center justify-between cursor-text">
            <span>Поиск</span>
            <Search className="w-4 h-4" />
          </div>
          <HelpCircle className="w-5 h-5 hover:text-gray-200 cursor-pointer transition-colors" />
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto flex flex-col pt-4 scrollbar-thin">
        
        {/* Welcome Header */}
        <div className="mt-8 mb-4 px-4">
          <div className="w-[68px] h-[68px] bg-discord-gray-500 rounded-full flex items-center justify-center mb-4">
            <Hash className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Добро пожаловать в #{channelName}!</h1>
          <p className="text-discord-gray-400 text-[15px]">
            Это начало истории канала <span className="font-medium text-discord-gray-300">#{channelName}</span>.
          </p>
        </div>

        {messages.map((msg) => {
          if (msg.type === 'divider') {
            return <DateDivider key={msg.id} date={msg.date!} />
          }
          return (
            <MessageItem 
              key={msg.id}
              id={msg.id!}
              author={msg.author!}
              content={msg.content!}
              timestamp={msg.timestamp!}
              isGroupStart={msg.isGroupStart}
              onContextMenu={handleContextMenu}
            />
          )
        })}
        
        {/* Anchor */}
        <div ref={messagesEndRef} className="h-4 flex-shrink-0"></div>
      </div>

      {/* Input */}
      <div className="px-4 pb-6 flex-shrink-0">
        <div className="bg-discord-gray-500/50 rounded-lg h-11 flex items-center px-4 gap-3">
          <button className="w-6 h-6 bg-discord-gray-400 text-discord-gray-700 rounded-full flex items-center justify-center hover:text-discord-gray-600 transition-colors">
            <Plus className="w-4 h-4" />
          </button>
          <input 
            type="text" 
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Написать в #${channelName}`} 
            className="bg-transparent border-none outline-none text-gray-200 w-full placeholder-discord-gray-400"
          />
        </div>
      </div>

      {/* Context Menu Overlay */}
      {contextMenu && (
        <div 
          className="fixed z-[200] w-52 bg-[#111214] rounded shadow-xl border border-[#1e1f22] p-1.5 flex flex-col gap-0.5 animate-in fade-in zoom-in-95 duration-100"
          style={{ top: contextMenu.y, left: contextMenu.x }}
          onClick={(e) => e.stopPropagation()} // Prevent bubbling to the window click handler immediately
        >
          <div className="flex items-center justify-between px-2 py-1.5 rounded text-sm text-discord-gray-300 hover:bg-discord-blue hover:text-white cursor-pointer transition-colors" onClick={() => setContextMenu(null)}>
            <span className="font-medium">Ответить</span>
            <MessageSquareReply className="w-4 h-4" />
          </div>
          <div className="flex items-center justify-between px-2 py-1.5 rounded text-sm text-discord-gray-300 hover:bg-discord-blue hover:text-white cursor-pointer transition-colors" onClick={() => { copyMessageText(); setContextMenu(null); }}>
            <span className="font-medium">Копировать текст</span>
            <Copy className="w-4 h-4" />
          </div>
          <div className="flex items-center justify-between px-2 py-1.5 rounded text-sm text-discord-gray-300 hover:bg-discord-blue hover:text-white cursor-pointer transition-colors" onClick={() => setContextMenu(null)}>
            <span className="font-medium">Изменить</span>
            <Pencil className="w-4 h-4" />
          </div>
          <div className="my-0.5 border-b border-[#2b2d31]"></div>
          <div className="flex items-center justify-between px-2 py-1.5 rounded text-sm text-red-400 hover:bg-red-500 hover:text-white cursor-pointer transition-colors" onClick={() => { handleDelete(); setContextMenu(null); }}>
            <span className="font-medium">Удалить сообщение</span>
            <Trash2 className="w-4 h-4" />
          </div>
        </div>
      )}
    </div>
  );
}
