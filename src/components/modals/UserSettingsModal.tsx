import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { cn } from '../../lib/utils';

export function UserSettingsModal() {
  const { isSettingsOpen, setSettingsOpen } = useAppStore();
  const [activeTab, setActiveTab] = useState('account');

  // Close on ESC
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSettingsOpen(false);
    };
    if (isSettingsOpen) window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isSettingsOpen, setSettingsOpen]);

  if (!isSettingsOpen) return null;

  const tabs = [
    { id: 'account', label: 'Моя учетная запись' },
    { id: 'profiles', label: 'Профили' },
    { id: 'privacy', label: 'Конфиденциальность' },
    { divider: true, id: 'd1' },
    { header: 'Настройки приложения', id: 'h1' },
    { id: 'appearance', label: 'Внешний вид' },
    { id: 'voice', label: 'Голос и видео' },
    { divider: true, id: 'd2' },
    { id: 'logout', label: 'Выйти', color: 'text-red-400' }
  ];

  return (
    <div className="fixed inset-0 z-[100] flex bg-discord-gray-600 animate-in fade-in duration-200">
      {/* Sidebar */}
      <div className="w-[35%] min-w-[250px] bg-discord-gray-700 flex justify-end pr-4 py-14">
        <div className="w-[192px] flex flex-col gap-0.5">
          <div className="px-2 pb-1 text-xs font-bold text-discord-gray-400 uppercase">Настройки пользователя</div>
          
          {tabs.map(tab => {
            if (tab.divider) return <div key={tab.id} className="my-2 border-b border-discord-gray-900/50"></div>;
            if (tab.header) return <div key={tab.id} className="px-2 pb-1 text-xs font-bold text-discord-gray-400 uppercase mt-2">{tab.header}</div>;
            
            const isActive = activeTab === tab.id;
            return (
              <div 
                key={tab.id}
                onClick={() => tab.id === 'logout' ? setSettingsOpen(false) : setActiveTab(tab.id)}
                className={cn(
                  "px-2 py-1.5 rounded cursor-pointer mb-0.5 transition-colors font-medium text-sm",
                  isActive ? "bg-discord-gray-500/60 text-gray-200" : "text-discord-gray-400 hover:bg-discord-gray-600/50 hover:text-gray-200",
                  tab.color ? tab.color : ""
                )}
              >
                {tab.label}
              </div>
            )
          })}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-discord-gray-600 p-10 py-14 relative overflow-y-auto">
        <div className="w-full max-w-[740px] pr-20">
          
          {activeTab === 'account' && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <h2 className="text-xl font-bold text-white mb-6">Моя учетная запись</h2>
              
              {/* Profile Card */}
              <div className="bg-[#1e1f22] rounded-lg pb-4 mb-8">
                <div className="h-[100px] bg-discord-blue rounded-t-lg relative">
                  <div className="absolute -bottom-10 left-4 w-[88px] h-[88px] rounded-full border-[6px] border-[#1e1f22] bg-discord-blue flex items-center justify-center text-4xl font-bold text-white shadow-sm cursor-pointer hover:opacity-90">
                    S
                    <div className="absolute bottom-0 right-0 w-6 h-6 rounded-full border-4 border-[#1e1f22] bg-green-500"></div>
                  </div>
                </div>
                
                <div className="mt-14 px-4 bg-[#1e1f22] rounded-b-lg">
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <div className="text-xl font-bold text-white">Scher</div>
                      <div className="text-sm text-discord-gray-400">scher#1234</div>
                    </div>
                    <button onClick={() => setActiveTab('profiles')} className="bg-discord-blue hover:bg-[#4752C4] text-white px-4 py-1.5 rounded text-sm font-medium transition-colors">
                      Редактировать профиль
                    </button>
                  </div>

                  <div className="bg-discord-gray-800 rounded-md p-4 flex flex-col gap-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="text-xs font-bold text-discord-gray-400 uppercase">Имя пользователя</div>
                        <div className="text-gray-200 text-sm mt-1">scher#1234</div>
                      </div>
                      <button className="bg-discord-gray-600 hover:bg-discord-gray-500 text-white px-4 py-1.5 rounded text-sm transition-colors">Изменить</button>
                    </div>
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="text-xs font-bold text-discord-gray-400 uppercase">Электронная почта</div>
                        <div className="text-gray-200 text-sm mt-1">sch********@gmail.com</div>
                      </div>
                      <button className="bg-discord-gray-600 hover:bg-discord-gray-500 text-white px-4 py-1.5 rounded text-sm transition-colors">Показать</button>
                    </div>
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="text-xs font-bold text-discord-gray-400 uppercase">Номер телефона</div>
                        <div className="text-gray-200 text-sm mt-1">Вы не добавили номер телефона.</div>
                      </div>
                      <button className="bg-discord-blue hover:bg-[#4752C4] text-white px-4 py-1.5 rounded text-sm transition-colors">Добавить</button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-discord-gray-700/50 pt-8">
                <h2 className="text-xl font-bold text-white mb-4">Пароль и аутентификация</h2>
                <button className="bg-discord-blue hover:bg-[#4752C4] text-white px-4 py-2 rounded text-sm font-medium transition-colors mb-6">
                  Изменить пароль
                </button>
                <div className="text-xs font-bold text-discord-gray-400 uppercase mb-2">Двухфакторная аутентификация</div>
                <p className="text-discord-gray-400 text-sm mb-4">Защитите свою учетную запись Discord с помощью дополнительного уровня безопасности. После настройки вам будет нужно вводить как пароль, так и код аутентификации.</p>
                <button className="bg-discord-blue hover:bg-[#4752C4] text-white px-4 py-2 rounded text-sm font-medium transition-colors">
                  Включить 2FA
                </button>
              </div>
            </div>
          )}

          {activeTab === 'profiles' && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <h2 className="text-xl font-bold text-white mb-6">Профили</h2>
              
              <div className="flex gap-8">
                <div className="flex-1">
                  <div className="mb-6">
                    <div className="text-xs font-bold text-discord-gray-400 uppercase mb-2">Отображаемое имя</div>
                    <input type="text" defaultValue="Scher" placeholder="Ваше имя" className="w-full bg-[#1e1f22] text-gray-200 p-2.5 rounded border border-discord-gray-900/50 outline-none focus:border-discord-blue transition-colors" />
                  </div>
                  <div className="mb-6">
                    <div className="text-xs font-bold text-discord-gray-400 uppercase mb-2">Местоимения</div>
                    <input type="text" placeholder="Укажите местоимения" className="w-full bg-[#1e1f22] text-gray-200 p-2.5 rounded border border-discord-gray-900/50 outline-none focus:border-discord-blue transition-colors" />
                  </div>
                  <div className="mb-6">
                    <div className="text-xs font-bold text-discord-gray-400 uppercase mb-2">Обо мне</div>
                    <textarea rows={4} defaultValue="Пишу клон Discord 🚀" placeholder="Расскажите о себе..." className="w-full bg-[#1e1f22] text-gray-200 p-2.5 rounded border border-discord-gray-900/50 outline-none resize-none focus:border-discord-blue transition-colors"></textarea>
                  </div>
                </div>

                <div className="w-[340px] flex-shrink-0">
                  <div className="text-xs font-bold text-discord-gray-400 uppercase mb-2">Предпросмотр</div>
                  <div className="bg-[#111214] rounded-lg pb-4 overflow-hidden border border-discord-gray-700/50 shadow-lg">
                    <div className="h-[60px] bg-discord-blue"></div>
                    <div className="px-4 relative pb-4 border-b border-discord-gray-700/50">
                      <div className="absolute -top-10 left-4 w-[72px] h-[72px] rounded-full border-[6px] border-[#111214] bg-discord-blue flex items-center justify-center text-3xl font-bold text-white shadow-sm">
                        S
                        <div className="absolute bottom-0 right-0 w-5 h-5 rounded-full border-4 border-[#111214] bg-green-500"></div>
                      </div>
                      <div className="mt-10 font-bold text-white text-xl">Scher</div>
                      <div className="text-sm text-discord-gray-200 mb-2">scher#1234</div>
                      <div className="w-full h-[1px] bg-discord-gray-700/50 my-3"></div>
                      <div className="text-xs font-bold text-discord-gray-400 uppercase mb-1">Обо мне</div>
                      <div className="text-sm text-gray-300">Пишу клон Discord 🚀</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'appearance' && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <h2 className="text-xl font-bold text-white mb-6">Внешний вид</h2>
              <p className="text-discord-gray-400 mb-4 font-medium uppercase text-xs">Тема приложения</p>
              <div className="flex gap-4">
                <div className="w-32 h-24 bg-discord-gray-800 border-2 border-discord-blue rounded-lg flex items-center justify-center text-white cursor-pointer relative overflow-hidden">
                   Тёмная
                   <div className="absolute top-2 right-2 w-5 h-5 bg-discord-blue rounded-full flex items-center justify-center">
                     <div className="w-2 h-2 bg-white rounded-full"></div>
                   </div>
                </div>
                <div className="w-32 h-24 bg-[#f2f3f5] border-2 border-transparent rounded-lg flex items-center justify-center text-black cursor-pointer opacity-50">Светлая</div>
              </div>
            </div>
          )}

          {activeTab === 'voice' && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <h2 className="text-xl font-bold text-white mb-6">Голос и видео</h2>
              
              <div className="flex gap-6 mb-8">
                <div className="flex-1">
                  <div className="text-xs font-bold text-discord-gray-400 uppercase mb-2">Устройство ввода</div>
                  <div className="w-full bg-[#1e1f22] text-gray-200 p-2.5 rounded border border-discord-gray-900/50 outline-none cursor-pointer hover:border-discord-gray-700 transition-colors">Default - Microphone (Realtek)</div>
                  <div className="mt-2 text-xs text-discord-gray-400 font-bold uppercase">Громкость микрофона</div>
                  <div className="mt-2 w-full h-[6px] bg-discord-gray-700 rounded-full overflow-hidden">
                    <div className="h-full bg-discord-blue w-[85%]"></div>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="text-xs font-bold text-discord-gray-400 uppercase mb-2">Устройство вывода</div>
                  <div className="w-full bg-[#1e1f22] text-gray-200 p-2.5 rounded border border-discord-gray-900/50 outline-none cursor-pointer hover:border-discord-gray-700 transition-colors">Default - Speakers (Realtek)</div>
                  <div className="mt-2 text-xs text-discord-gray-400 font-bold uppercase">Громкость звука</div>
                  <div className="mt-2 w-full h-[6px] bg-discord-gray-700 rounded-full overflow-hidden">
                    <div className="h-full bg-discord-blue w-full"></div>
                  </div>
                </div>
              </div>
              
              <div className="mb-8 border-b border-discord-gray-700/50 pb-8">
                <div className="text-xs font-bold text-discord-gray-400 uppercase mb-4">Режим ввода</div>
                <div className="flex flex-col gap-4">
                  <label className="flex items-center gap-3 cursor-pointer text-gray-200 hover:text-white transition-colors">
                    <div className="w-6 h-6 rounded-full border-2 border-discord-blue flex items-center justify-center">
                      <div className="w-3 h-3 bg-discord-blue rounded-full"></div>
                    </div>
                    <span className="text-[15px] font-medium">Активация по голосу</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer text-discord-gray-300 hover:text-gray-200 transition-colors">
                    <div className="w-6 h-6 rounded-full border-2 border-discord-gray-500"></div>
                    <span className="text-[15px] font-medium">Режим рации (Push to Talk)</span>
                  </label>
                </div>
              </div>
            </div>
          )}
          
          {/* Other tabs fallback */}
          {['privacy'].includes(activeTab) && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <h2 className="text-xl font-bold text-white mb-6">В разработке</h2>
              <p className="text-discord-gray-400">Эта вкладка пока пуста. Дисковод еще строится! 🚧</p>
            </div>
          )}
          
        </div>

        {/* Close Button */}
        <div className="absolute top-14 right-10 flex flex-col items-center">
          <div 
            onClick={(e) => {
              e.stopPropagation();
              setSettingsOpen(false);
            }}
            className="w-9 h-9 border-2 border-discord-gray-400 rounded-full flex items-center justify-center text-discord-gray-400 hover:bg-discord-gray-400/20 hover:text-white cursor-pointer transition-colors mb-1 z-[110]"
          >
            <X className="w-5 h-5 pointer-events-none" />
          </div>
          <div className="text-[13px] font-bold text-discord-gray-400 text-center">ESC</div>
        </div>
      </div>
    </div>
  );
}
