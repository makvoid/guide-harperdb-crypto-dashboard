import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router'

import { HeaderComponent } from './header/header.component'
import { BreadcrumbComponent } from './breadcrumb/breadcrumb.component'
import { ModalComponent } from './modal/modal.component'
import { SpinnerComponent } from './spinner/spinner.component'

@NgModule({
  declarations: [
    HeaderComponent,
    BreadcrumbComponent,
    ModalComponent,
    SpinnerComponent
  ],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [
    HeaderComponent,
    BreadcrumbComponent,
    ModalComponent,
    SpinnerComponent
  ]
})
export class SharedModule { }
