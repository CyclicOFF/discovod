import { create } from 'zustand';

export interface Message {
  id: string;
  type?: 'message' | 'divider';
  date?: string;
  author?: {
    name: string;
    avatarUrl?: string;
    color?: string;
  };
  content?: string;
  timestamp?: string;
  isGroupStart?: boolean;
}

interface AppState {
  activeServerId: string | null;
  activeChannelId: string | null;
  setActiveServer: (id: string) => void;
  setActiveChannel: (id: string) => void;
  
  isSettingsOpen: boolean;
  setSettingsOpen: (open: boolean) => void;
  
  userPopout: { rect: DOMRect; member: any; position?: 'right' | 'left' | 'top' } | null;
  setUserPopout: (popout: { rect: DOMRect; member: any; position?: 'right' | 'left' | 'top' } | null) => void;
  
  isMuted: boolean;
  isDeafened: boolean;
  toggleMute: () => void;
  toggleDeafen: () => void;
  
  messagesByChannel: Record<string, Message[]>;
  addMessage: (channelId: string, content: string) => void;
  deleteMessage: (channelId: string, messageId: string) => void;
}

const INITIAL_MESSAGES: Record<string, Message[]> = {
  general: [
    { id: 'd1', type: 'divider', date: "12 октября 2023 г." },
    { id: '1', author: { name: "Scher", color: "#4ade80" }, content: "Всем привет! Я начал делать Дисковод.", timestamp: "Вчера, в 14:20", isGroupStart: true },
    { id: '2', author: { name: "Scher", color: "#4ade80" }, content: "Бэкенд будет на расте, так что всё должно летать 🚀", timestamp: "Вчера, в 14:21", isGroupStart: false },
    { id: 'd2', type: 'divider', date: "Сегодня" },
    { id: '3', author: { name: "RustBro", color: "#f87171" }, content: "О, круто. Я как раз сейчас дописываю WebSocket сервер.", timestamp: "Сегодня, в 18:24", isGroupStart: true },
    { id: '4', author: { name: "Scher", color: "#4ade80" }, content: "Отлично. Я уже разбил фронт на компоненты и добавил Zustand.", timestamp: "Сегодня, в 18:30", isGroupStart: true },
    { id: '5', author: { name: "Scher", color: "#4ade80" }, content: "Выглядит прям 1-в-1 как настоящий дискорд.", timestamp: "Сегодня, в 18:31", isGroupStart: false },
  ],
  flood: [
    { id: 'd3', type: 'divider', date: "Сегодня" },
    { id: 'f1', author: { name: "RustBro", color: "#f87171" }, content: "Кто-нибудь смотрел новый фильм про паука?", timestamp: "Сегодня, в 12:00", isGroupStart: true },
    { id: 'f2', author: { name: "Scher", color: "#4ade80" }, content: "Да, вчера ходил в кино. Визуал просто отвал башки!", timestamp: "Сегодня, в 12:45", isGroupStart: true },
    { id: 'f3', author: { name: "Scher", color: "#4ade80" }, content: "Особенно сцена в конце.", timestamp: "Сегодня, в 12:45", isGroupStart: false },
  ],
  voice: [
    { id: 'd4', type: 'divider', date: "Сегодня" },
    { id: 'v1', author: { name: "System", color: "#5865F2" }, content: "Scher зашел в комнату.", timestamp: "Сегодня, в 19:00", isGroupStart: true }
  ]
};

export const CHANNELS_BY_SERVER: Record<string, { id: string, name: string, type: 'text' | 'voice' }[]> = {
  'server-1': [
    { id: 'general', name: 'основной', type: 'text' },
    { id: 'flood', name: 'флудилка', type: 'text' },
    { id: 'voice', name: 'Основной', type: 'voice' },
  ],
  'server-2': [
    { id: 'rust-general', name: 'rust-general', type: 'text' },
    { id: 'backend-dev', name: 'backend-dev', type: 'text' },
    { id: 'cargo', name: 'cargo-discussion', type: 'text' },
  ]
};

export const useAppStore = create<AppState>((set) => ({
  activeServerId: 'server-1',
  activeChannelId: 'general',
  isSettingsOpen: false,
  setSettingsOpen: (open) => set({ isSettingsOpen: open }),
  
  userPopout: null,
  setUserPopout: (popout) => set({ userPopout: popout }),
  
  isMuted: false,
  isDeafened: false,
  toggleMute: () => set((state) => {
    if (state.isDeafened) {
      return { isDeafened: false, isMuted: false };
    }
    return { isMuted: !state.isMuted };
  }),
  toggleDeafen: () => set((state) => {
    const newDeaf = !state.isDeafened;
    return { isDeafened: newDeaf, isMuted: newDeaf ? true : state.isMuted };
  }),

  setActiveServer: (id) => set((state) => {
    if (id === 'home') {
      return { activeServerId: id, activeChannelId: null };
    }
    const firstChannel = CHANNELS_BY_SERVER[id]?.[0]?.id || null;
    return { activeServerId: id, activeChannelId: firstChannel };
  }),
  setActiveChannel: (id) => set({ activeChannelId: id }),
  
  messagesByChannel: INITIAL_MESSAGES,
  
  addMessage: (channelId, content) => set((state) => {
    const channelMsgs = state.messagesByChannel[channelId] || [];
    
    // Check if we should group with the previous message
    const lastMsg = channelMsgs[channelMsgs.length - 1];
    let isGroupStart = true;
    
    if (lastMsg && lastMsg.type !== 'divider' && lastMsg.author?.name === "Scher") {
      isGroupStart = false; // same author as previous message
    }
    
    const now = new Date();
    const timeString = `Сегодня, в ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    
    const newMessage: Message = {
      id: Date.now().toString(),
      author: { name: "Scher", color: "#4ade80" }, // Current user
      content,
      timestamp: timeString,
      isGroupStart
    };
    
    return {
      messagesByChannel: {
        ...state.messagesByChannel,
        [channelId]: [...channelMsgs, newMessage]
      }
    };
  }),
  
  deleteMessage: (channelId, messageId) => set((state) => {
    const channelMsgs = state.messagesByChannel[channelId] || [];
    return {
      messagesByChannel: {
        ...state.messagesByChannel,
        [channelId]: channelMsgs.filter(m => m.id !== messageId)
      }
    };
  })
}));
