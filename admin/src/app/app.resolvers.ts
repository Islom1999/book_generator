import { inject } from '@angular/core'
import { ContentLanguagesService } from 'app/core/languages/content-languages.service'
import { NavigationService } from 'app/core/navigation/navigation.service'
import { MessagesService } from 'app/layout/common/messages/messages.service'
import { NotificationsService } from 'app/layout/common/notifications/notifications.service'
import { QuickChatService } from 'app/layout/common/quick-chat/quick-chat.service'
import { ShortcutsService } from 'app/layout/common/shortcuts/shortcuts.service'
import { forkJoin } from 'rxjs'

export const initialDataResolver = () => {
  return forkJoin([
    inject(NavigationService).get(),
    inject(ContentLanguagesService).load(),
    inject(MessagesService).getAll(),
    inject(NotificationsService).getAll(),
    inject(QuickChatService).getChats(),
    inject(ShortcutsService).getAll(),
  ])
}
