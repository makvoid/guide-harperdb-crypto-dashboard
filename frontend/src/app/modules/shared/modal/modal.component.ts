import { Component, ElementRef, EventEmitter, Input, TemplateRef } from '@angular/core'

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent {
  @Input() display = false
  @Input() title: string = ''
  @Input() bodyTemplate!: TemplateRef<ElementRef>
  @Input() footerTemplate!: TemplateRef<ElementRef>
  @Input() onClose: EventEmitter<null> = new EventEmitter<null>()
  @Input() showCloseBtn: boolean = true

  show () {
    this.display = true
  }

  hide (sendCloseEvent = true) {
    this.display = false
    if (sendCloseEvent) this.onClose.emit()
  }
}
