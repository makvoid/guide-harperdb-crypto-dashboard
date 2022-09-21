import { Component, Input } from '@angular/core'

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html'
})
export class BreadcrumbComponent {
  @Input() pageTitle: string | null = null
}
