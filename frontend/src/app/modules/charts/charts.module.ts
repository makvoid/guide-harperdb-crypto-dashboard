import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { NgxChartsModule } from '@swimlane/ngx-charts'

import { SparklineComponent } from './sparkline/sparkline.component'
import { PriceTrackerComponent } from './price-tracker/price-tracker.component'

@NgModule({
  declarations: [
    SparklineComponent,
    PriceTrackerComponent
  ],
  imports: [
    CommonModule,
    NgxChartsModule
  ],
  exports: [
    PriceTrackerComponent
  ]
})
export class ChartsModule { }
