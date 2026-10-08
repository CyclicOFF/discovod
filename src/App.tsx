import React, { useEffect } from 'react';
import { ServersSidebar } from './components/layout/ServersSidebar';
import { ChannelsSidebar } from './components/layout/ChannelsSidebar';
import { ChatArea } from './components/layout/ChatArea';
import { MembersSidebar } from './components/layout/MembersSidebar';
import { UserSettingsModal } from './components/modals/UserSettingsModal';
import { UserProfilePopout } from './components/modals/UserProfilePopout';
import { socketClient } from './lib/socket';

function App() {
  // Подключаемся к Rust-серверу при запуске приложения
  useEffect(() => {
    // Раскомментируй строку ниже, когда бэкенд будет запущен!
    // socketClient.connect();
  }, []);

  return (
    <div className="flex h-screen w-full bg-discord-gray-600 text-gray-100 font-sans">
      <ServersSidebar />
      <ChannelsSidebar />
      <ChatArea />
      <MembersSidebar />
      
      {/* Modals and Overlays */}
      <UserSettingsModal />
      <UserProfilePopout />
    </div>
  );
}

export default App;
