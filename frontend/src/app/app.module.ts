import { HttpClientModule } from '@angular/common/http'
import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { MonacoEditorModule } from 'ngx-monaco-editor'
import { ToastrModule } from 'ngx-toastr'
import { NgxChartsModule } from '@swimlane/ngx-charts'
import { TimeagoModule } from 'ngx-timeago'

import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { AuthGuard } from './extra/auth-guard'
import { ChartsModule } from './modules/charts/charts.module'
import { SharedModule } from './modules/shared/shared.module'

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    SharedModule,
    ChartsModule,
    MonacoEditorModule.forRoot(),
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    NgxChartsModule,
    TimeagoModule.forRoot()
  ],
  providers: [AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
