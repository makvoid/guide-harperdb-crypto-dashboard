import { Component, Input, OnInit } from '@angular/core'
import { flat } from 'radash'

import { FeedHandler, Article } from 'src/app/extra/models'

interface ListArticle extends Article {
  categories: string[]
  feedName: string
}

@Component({
  selector: 'app-dashboard-articles',
  templateUrl: './dashboard-articles.component.html',
  styleUrls: ['./dashboard-articles.component.css']
})
export class DashboardArticlesComponent implements OnInit {
  @Input('categories') categories: string[] = []
  @Input('feeds') feeds: FeedHandler[] = []
  parsedArticles: ListArticle[] = []
  activeTab: string = ''

  tabActive (category: string) {
    return this.activeTab === category
  }

  setActiveTab (category: string) {
    this.activeTab = category
  }

  getCategoryArticles (category: string) {
    return this.parsedArticles.filter(article => article.categories.includes(category))
  }

  parseData () {
    this.parsedArticles = flat(this.feeds.map(feed => {
      if (feed.articles) {
        return feed.articles.map(article => ({
          ...article,
          feedName: feed.name,
          categories: feed.categories
        }))
      } else {
        return []
      }
    }))
    this.parsedArticles.sort((a, b) => {
      return new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime()
    })
    if (this.activeTab === '' && this.categories.length) {
      this.activeTab = this.categories[0]
    }
  }

  ngOnInit () {
    this.parseData()
  }
}
