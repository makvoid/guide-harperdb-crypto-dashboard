import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { TimeagoModule } from 'ngx-timeago'

import { DashboardHomeComponent } from './dashboard-home/dashboard-home.component'
import { DashboardRoutingModule } from './dashboard-routing.module'
import { SharedModule } from '../shared/shared.module'
import { DashboardService } from './dashboard.service'
import { DashboardArticlesComponent } from './dashboard-articles/dashboard-articles.component'
import { DashboardTrackersComponent } from './dashboard-trackers/dashboard-trackers.component'
import { ChartsModule } from '../charts/charts.module'

@NgModule({
  declarations: [
    DashboardHomeComponent,
    DashboardArticlesComponent,
    DashboardTrackersComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    ChartsModule,
    DashboardRoutingModule,
    TimeagoModule.forChild()
  ],
  providers: [DashboardService]
})
export class DashboardModule { }
