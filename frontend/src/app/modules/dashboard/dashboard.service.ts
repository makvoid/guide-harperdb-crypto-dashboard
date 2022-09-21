import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { CookieService } from 'ngx-cookie-service'
import { DashboardInfo } from 'src/app/extra/models'
import { environment } from 'src/environments/environment'

@Injectable({ providedIn: 'root' })
export class DashboardService {
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
  ) { }

  getInformation () {
    return this.http.get<DashboardInfo>(
      `${environment.apiUrl}dashboard`,
      this.baseOptions
    )
  }
}
