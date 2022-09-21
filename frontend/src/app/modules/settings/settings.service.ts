import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { CookieService } from 'ngx-cookie-service'

import { environment } from 'src/environments/environment'
import { FeedCategory, FeedHandler, Settings, TrackedCoin } from 'src/app/extra/models'
import {
  HarperDBDeletionRequest,
  HarperDBInsertRequest,
  HarperDBUpdateRequest
} from 'src/app/extra/harperdb'

@Injectable({ providedIn: 'root' })
export class SettingsService {
  // Base headers to include with every request
  baseOptions = {
    headers: {
      Authorization: `Basic ${this.cookieService.get('token')}`,
      'Content-Type': 'application/json'
    }
  }

  constructor (
    private http: HttpClient,
    private cookieService: CookieService
  ) {}

  getSettings () {
    return this.http.get<Settings>(
      `${environment.apiUrl}settings`,
      this.baseOptions
    )
  }

  addTrackedCoin (coin: TrackedCoin) {
    return this.http.post<HarperDBInsertRequest>(
      `${environment.apiUrl}tracked`,
      coin,
      this.baseOptions
    )
  }

  deleteTrackedCoin (coin: TrackedCoin) {
    return this.http.delete<HarperDBDeletionRequest>(
      `${environment.apiUrl}tracked/${coin.id}`,
      this.baseOptions
    )
  }

  addFeedHandler (record: FeedHandler) {
    return this.http.post<HarperDBInsertRequest>(
      `${environment.apiUrl}feed-handler`,
      record,
      this.baseOptions
    )
  }

  editFeedHandler (record: FeedHandler) {
    return this.http.post<HarperDBUpdateRequest>(
      `${environment.apiUrl}feed-handler/${record.id}`,
      record,
      this.baseOptions
    )
  }

  deleteFeedHandler (record: FeedHandler) {
    return this.http.delete<HarperDBDeletionRequest>(
      `${environment.apiUrl}feed-handler/${record.id}`,
      this.baseOptions
    )
  }

  addFeedCategory (category: string) {
    return this.http.post<HarperDBInsertRequest>(
      `${environment.apiUrl}feed-category`,
      { name: category },
      this.baseOptions
    )
  }

  deleteFeedCategory (category: FeedCategory) {
    return this.http.delete<HarperDBDeletionRequest>(
      `${environment.apiUrl}feed-category/${category.id}`,
      this.baseOptions
    )
  }
}
