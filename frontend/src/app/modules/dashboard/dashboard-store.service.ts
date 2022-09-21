import { Injectable } from '@angular/core'
import { BehaviorSubject, firstValueFrom } from 'rxjs'

import { DashboardInfo } from 'src/app/extra/models'
import { DashboardService } from './dashboard.service'

@Injectable({ providedIn: 'root' })
export class DashboardStoreService {
  /** DashboardInfo */
  private readonly _info = new BehaviorSubject<DashboardInfo>({
    trackedCoins: [],
    feeds: [],
    categories: []
  })

  readonly info$ = this._info.asObservable()

  get info (): DashboardInfo {
    return this._info.getValue()
  }

  set info (val: DashboardInfo) {
    this._info.next(val)
  }

  /** Loading */
  private readonly _loading = new BehaviorSubject<boolean>(false)
  readonly loading$ = this._loading.asObservable()

  /**
     * Obtain the loading state
     */
  get loading (): boolean {
    return this._loading.getValue()
  }

  /**
     * Set the loading state
     */
  set loading (val: boolean) {
    this._loading.next(val)
  }

  constructor (private dashboardService: DashboardService) {
    this.fetchAll()
  }

  async fetchAll (showSpinner = true) {
    if (showSpinner) this.loading = true
    try {
      this.info = await firstValueFrom(this.dashboardService.getInformation())
    } catch (e) {
      console.error(e)
    }
    if (showSpinner) this.loading = false
  }
}
