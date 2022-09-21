import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { AutocompleteLibModule } from 'angular-ng-autocomplete'
import { CookieService } from 'ngx-cookie-service'
import { ToastrModule, ToastrService } from 'ngx-toastr'
import { MonacoEditorModule } from 'ngx-monaco-editor'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpClientModule } from '@angular/common/http'

import { SettingsStoreService } from './settings-store.service'
import { SettingsRoutingModule } from './settings-routing.module'
import { SettingsComponent } from './settings/settings.component'
import { SharedModule } from '../shared/shared.module'
import { PriceTrackerSettingsComponent } from './price-tracker-settings/price-tracker-settings.component'
import { FeedHandlerSettingsComponent } from './feed-handler-settings/feed-handler-settings.component'
import { ConfiguredFeedsComponent } from './feed-handler-settings/configured-feeds/configured-feeds.component'
import { FeedCategoriesComponent } from './feed-handler-settings/feed-categories/feed-categories.component'
import { SettingsService } from './settings.service'

@NgModule({
  declarations: [
    SettingsComponent,
    PriceTrackerSettingsComponent,
    FeedHandlerSettingsComponent,
    ConfiguredFeedsComponent,
    FeedCategoriesComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    SettingsRoutingModule,
    AutocompleteLibModule,
    MonacoEditorModule,
    ToastrModule
  ],
  providers: [CookieService, ToastrService, SettingsService, SettingsStoreService]
})
export class SettingsModule { }
