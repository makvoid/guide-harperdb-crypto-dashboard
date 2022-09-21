export interface Article {
  id: string
  title: string
  categories: string[]
  contentSnippet: string
  image: string
  link: string
  feed: string
  pubDate: Date
  isoDate: Date
__updatedtime__: Date
__createdtime__: Date
}

export interface FeedHandler {
  id?: string
  name: string
  url: string
  categories: string[]
  settings?: string
  articles?: Article[]
}

export interface TrackedCoin {
  id?: string
  coin: string
  trackTotal: boolean
  startPrice: number
  totalOwned: number
}

export interface FeedCategory {
  id?: string
  name: string
}

export interface Settings {
  trackedCoins: TrackedCoin[]
  coinList: string[]
  feeds: FeedHandler[]
  categories: FeedCategory[]
}

export interface PriceTrackerChartEntry {
  name: Date
  value: number
}

export interface PriceTrackerHistory {
  price: number
  coin: string
  date: Date
  symbol: string
  __createdtime__: number
}

export interface PriceTracker {
  coin: string
  price: number
  symbol: string
  trackTotal: boolean
  startPrice?: number
  totalOwned?: number
  history?: PriceTrackerHistory[]
  data?: [{series: PriceTrackerChartEntry[]}]
}

export interface DashboardInfo {
  trackedCoins: PriceTracker[]
  feeds: []
  categories: string[]
}
