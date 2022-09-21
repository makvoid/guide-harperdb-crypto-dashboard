import { Injectable } from '@angular/core'
import { ToastrService } from 'ngx-toastr'
import { BehaviorSubject, firstValueFrom } from 'rxjs'

import { Settings } from 'src/app/extra/models'
import { SettingsService } from './settings.service'

@Injectable({ providedIn: 'root' })
export class SettingsStoreService {
  constructor (
    private settingsService: SettingsService,
    private toastr: ToastrService
  ) {
    this.fetchAll()
  }

  private readonly _settings = new BehaviorSubject<Settings>({
    trackedCoins: [],
    coinList: [],
    feeds: [],
    categories: []
  })

  readonly settings$ = this._settings.asObservable()

  // Loading state
  private readonly _loading = new BehaviorSubject<boolean>(false)
  readonly loading$ = this._loading.asObservable()

  /**
     * Obtain the current dashboard loading state
     */
  get loading (): boolean {
    return this._loading.getValue()
  }

  /**
     * Set the current dashboard loading state
     */
  set loading (val: boolean) {
    this._loading.next(val)
  }

  get settings (): Settings {
    return this._settings.getValue()
  }

  set settings (val: Settings) {
    this._settings.next(val)
  }

  async fetchAll (showSpinner = true) {
    if (showSpinner) this.loading = true
    try {
      this.settings = await firstValueFrom(this.settingsService.getSettings())
    } catch (e) {
      const errorString = 'Unable to load settings state'
      // Logger.error(e, errorString)
      console.error(e) // TODO change
      this.toastr.error(errorString)
      return
    }
    if (showSpinner) this.loading = false
  }
}
