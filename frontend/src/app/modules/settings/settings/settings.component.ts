import { Component, OnInit, EventEmitter, OnDestroy } from '@angular/core'
import { Title } from '@angular/platform-browser'
import { Observable, Subscription } from 'rxjs'

import { environment } from 'src/environments/environment'
import { SettingsStoreService } from '../settings-store.service'

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html'
})
export class SettingsComponent implements OnInit, OnDestroy {
  subscriptions: Subscription[] = []
  updateState: EventEmitter<null> = new EventEmitter<null>()
  updateState$: Observable<null> = this.updateState.asObservable()

  constructor (
    private titleService: Title,
    public settingsStore: SettingsStoreService
  ) { }

  ngOnDestroy () {
    this.subscriptions.map(sub => sub.unsubscribe())
  }

  ngOnInit (): void {
    this.titleService.setTitle('Settings' + environment.titleTag)

    this.subscriptions.push(
      this.updateState$.subscribe(() => this.settingsStore.fetchAll())
    )
  }
}
