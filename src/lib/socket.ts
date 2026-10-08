import { useAppStore } from '../store/useAppStore';

// === ТИПЫ ДАННЫХ ДЛЯ БЭКЕНДЕРА (RUST) ===
// Бэкендер должен присылать JSON именно в таком формате:
// { "type": "MESSAGE_CREATE", "payload": { ... } }

export type ServerEvent = 
  | { type: 'MESSAGE_CREATE'; payload: { channelId: string; message: any } }
  | { type: 'MESSAGE_DELETE'; payload: { channelId: string; messageId: string } }
  | { type: 'PRESENCE_UPDATE'; payload: { userId: string; status: 'online' | 'offline' | 'idle' | 'dnd' } };

class SocketClient {
  private ws: WebSocket | null = null;
  private url: string;
  private reconnectTimer: any = null;

  constructor(url: string) {
    this.url = url;
  }

  connect() {
    if (this.ws) return;
    
    console.log(`[WebSocket] Соединение с ${this.url}...`);
    this.ws = new WebSocket(this.url);

    this.ws.onopen = () => {
      console.log('[WebSocket] Успешно подключено к Rust Backend!');
      if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
    };

    this.ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data) as ServerEvent;
        this.handleServerEvent(data);
      } catch (err) {
        console.error('[WebSocket] Ошибка парсинга сообщения:', err);
      }
    };

    this.ws.onclose = () => {
      console.log('[WebSocket] Соединение закрыто. Переподключение через 3 секунды...');
      this.ws = null;
      this.reconnectTimer = setTimeout(() => this.connect(), 3000);
    };

    this.ws.onerror = (error) => {
      console.error('[WebSocket] Ошибка:', error);
      this.ws?.close();
    };
  }

  private handleServerEvent(event: ServerEvent) {
    const store = useAppStore.getState();

    switch (event.type) {
      case 'MESSAGE_CREATE':
        // Если сервер прислал новое сообщение от другого юзера, добавляем его в стейт
        console.log('[WebSocket] Получено новое сообщение:', event.payload);
        // store.addMessageFromServer(...) - нужно будет реализовать в будущем
        break;
      
      case 'MESSAGE_DELETE':
        store.deleteMessage(event.payload.channelId, event.payload.messageId);
        break;

      case 'PRESENCE_UPDATE':
        console.log('[WebSocket] Обновление статуса юзера:', event.payload);
        break;
        
      default:
        console.warn('[WebSocket] Неизвестный тип события:', event);
    }
  }

  // === МЕТОДЫ ДЛЯ ОТПРАВКИ НА СЕРВЕР ===
  
  sendMessage(channelId: string, content: string) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({
        action: 'SEND_MESSAGE',
        payload: { channelId, content }
      }));
    } else {
      console.warn('[WebSocket] Нет подключения к серверу. Сообщение осталось только на клиенте.');
    }
  }
}

// По умолчанию мы стучимся на локальный порт 8080.
// Бэкендер на Rust должен поднять WebSocket сервер на ws://127.0.0.1:8080/ws
export const socketClient = new SocketClient('ws://127.0.0.1:8080/ws');
