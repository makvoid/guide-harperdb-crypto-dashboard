import { Component, EventEmitter, Input } from '@angular/core'

import { FeedCategory, FeedHandler } from 'src/app/extra/models'

@Component({
  selector: 'app-feed-handler-settings',
  templateUrl: './feed-handler-settings.component.html'
})
export class FeedHandlerSettingsComponent {
  @Input() activeCategories: FeedCategory[] = []
  @Input() configuredFeeds: FeedHandler[] = []
  @Input() updateState: EventEmitter<null> = new EventEmitter<null>()
}
