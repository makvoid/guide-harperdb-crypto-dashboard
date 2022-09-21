import { Component, Input, OnInit } from '@angular/core'

import { PriceTracker, PriceTrackerHistory } from 'src/app/extra/models'

@Component({
  selector: 'app-dashboard-trackers',
  templateUrl: './dashboard-trackers.component.html'
})
export class DashboardTrackersComponent implements OnInit {
  @Input('trackedCoins') trackedCoins: PriceTracker[] = []
  parsedCoins: PriceTracker[] = []

  constructor () { }

  parseData () {
    this.parsedCoins = this.trackedCoins.map(coin => ({
      ...coin,
      data: [{
        series: coin.history!.map((event: PriceTrackerHistory) => ({
          name: new Date(event.__createdtime__),
          value: event.price
        }))
      }]
    }))
  }

  ngOnInit (): void {
    this.parseData()
  }
}
