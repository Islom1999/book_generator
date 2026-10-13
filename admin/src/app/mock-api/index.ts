// Layout widgets (messages, notifications, chat, shortcuts) still use Fuse mock data.
// Auth, user and navigation come from the real backend.
import { ChatMockApi } from 'app/mock-api/apps/chat/api'
import { MessagesMockApi } from 'app/mock-api/common/messages/api'
import { NotificationsMockApi } from 'app/mock-api/common/notifications/api'
import { SearchMockApi } from 'app/mock-api/common/search/api'
import { ShortcutsMockApi } from 'app/mock-api/common/shortcuts/api'

export const mockApiServices = [
  ChatMockApi,
  MessagesMockApi,
  NotificationsMockApi,
  SearchMockApi,
  ShortcutsMockApi,
]
