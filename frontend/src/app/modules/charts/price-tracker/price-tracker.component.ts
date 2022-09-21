import { Component, Input } from '@angular/core'
import * as shape from 'd3-shape'

import { PriceTracker, PriceTrackerChartEntry } from 'src/app/extra/models'

@Component({
  selector: 'app-price-tracker',
  templateUrl: './price-tracker.component.html'
})
export class PriceTrackerComponent {
  @Input() coin!: PriceTracker
  @Input() data!: [{series: PriceTrackerChartEntry[]}]

  curve = shape.curveLinear

  getPriceTrend () {
    if (!this.data) return
    const [old, latest] = this.data[0].series.slice(-2)
    if (!latest || !old) return 'down'
    return old.value < latest.value ? 'up' : 'down'
  }

  formatCurrency (input: number) {
    return new Intl.NumberFormat(
      'en-US', {
        style: 'currency',
        currency: 'USD'
      }
    ).format(input)
  }

  formatNumber (input: number) {
    return new Intl.NumberFormat('en-US').format(input)
  }

  getLatestPrice () {
    if (!this.data) return
    const latest = this.data[0].series[this.data[0].series.length - 1]
    if (!latest) return '$0.00'
    return this.formatCurrency(latest.value)
  }

  getTotalPrice () {
    if (!this.coin.trackTotal || !this.coin.totalOwned) return 0
    return this.formatCurrency(
      this.coin.totalOwned * this.data[0].series[this.data[0].series.length - 1].value
    )
  }

  getTotalProfit () {
    const latest = this.data[0].series[this.data[0].series.length - 1]?.value
    if (!latest) {
      return {
        trend: 'down',
        profit: '$0.00',
        percent: 0
      }
    }
    const cost = this.coin.startPrice! * this.coin.totalOwned!
    const value = latest * this.coin.totalOwned!
    return {
      trend: value - cost < 0 ? 'down' : 'up',
      profit: this.formatCurrency(value - cost),
      percent: Math.round((value - cost) / cost * 100.0)
    }
  }

  getSymbol () {
    if (this.coin.history && this.coin.history.length) {
      return this.coin.history[0].symbol
    }
    return this.coin.coin
  }
}
