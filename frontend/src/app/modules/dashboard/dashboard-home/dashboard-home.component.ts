import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core'
import { Title } from '@angular/platform-browser'

import { environment } from 'src/environments/environment'
import { DashboardArticlesComponent } from '../dashboard-articles/dashboard-articles.component'
import { DashboardStoreService } from '../dashboard-store.service'
import { DashboardTrackersComponent } from '../dashboard-trackers/dashboard-trackers.component'

@Component({
  selector: 'app-dashboard-home',
  templateUrl: './dashboard-home.component.html'
})
export class DashboardHomeComponent implements OnInit, OnDestroy {
  @ViewChild(DashboardArticlesComponent) articlesComponent!: DashboardArticlesComponent
  @ViewChild(DashboardTrackersComponent) trackersComponent!: DashboardTrackersComponent

  // How often to update the dashboard's state in seconds
  updateTimerSeconds: number = 30

  // Variable to hold the timer
  stateUpdateTimer: ReturnType<typeof setInterval> | null = null

  constructor (
    private titleService: Title,
    public dashboardStore: DashboardStoreService
  ) { }

  onUpdate () {
    // Refresh articles view
    this.articlesComponent.parseData()

    // Refresh trackers view
    // TODO ?
  }

  ngOnInit (): void {
    this.titleService.setTitle('Dashboard' + environment.titleTag)

    // Set a timer to update the state as configured
    this.stateUpdateTimer = setInterval(async () => {
      await this.dashboardStore.fetchAll(false)
      this.onUpdate()
    }, this.updateTimerSeconds * 1000)
  }

  ngOnDestroy (): void {
    if (this.stateUpdateTimer) clearInterval(this.stateUpdateTimer)
  }
}
