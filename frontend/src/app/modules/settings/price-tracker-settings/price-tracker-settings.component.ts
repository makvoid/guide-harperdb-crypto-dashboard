import { Component, EventEmitter, Input, ViewChild } from '@angular/core'
import { FormBuilder, Validators } from '@angular/forms'
import { AutocompleteComponent } from 'angular-ng-autocomplete'
import { ToastrService } from 'ngx-toastr'
import { firstValueFrom } from 'rxjs'

import { BaseFormComponent } from 'src/app/extra/base-form-component'
import { TrackedCoin } from 'src/app/extra/models'
import { ModalComponent } from '../../shared/modal/modal.component'
import { SettingsService } from '../settings.service'

@Component({
  selector: 'app-price-tracker-settings',
  templateUrl: './price-tracker-settings.component.html'
})
export class PriceTrackerSettingsComponent extends BaseFormComponent {
  @Input() updateState: EventEmitter<null> = new EventEmitter<null>()
  @Input() trackedCoins: TrackedCoin[] = []
  @Input() coinList: string[] = []

  @ViewChild('modal', { static: false }) modal!: ModalComponent
  @ViewChild('selector', { static: true }) coinSelector!: AutocompleteComponent

  override form = this.formBuilder.group({
    coin: [null],
    trackTotal: [false],
    startPrice: [0],
    totalOwned: [0]
  })

  constructor (
    private toastr: ToastrService,
    private settingsService: SettingsService,
    public override formBuilder: FormBuilder
  ) {
    super(formBuilder)
  }

  toggleTrackTotal (event: Event) {
    const target = (event.target as HTMLInputElement)
    const startPrice = this.form.get('startPrice')!
    const totalOwned = this.form.get('totalOwned')!
    if (target.checked) {
      startPrice.addValidators([Validators.min(0), Validators.required])
      totalOwned.addValidators([Validators.min(0.00000001), Validators.required])
    } else {
      startPrice.removeValidators([Validators.min(0), Validators.required])
      startPrice.reset()
      totalOwned.removeValidators([Validators.min(0.00000001), Validators.required])
      totalOwned.reset()
    }
  }

  async submitModal () {
    // Ensure the form is valid
    if (!this.form.valid) {
      Object.keys(this.form.controls).forEach(field =>
        this.form.get(field)!.markAsDirty()
      )
      return
    }

    const form = this.form.value
    try {
      await firstValueFrom(this.settingsService.addTrackedCoin({
        coin: form.coin,
        trackTotal: form.trackTotal,
        startPrice: form.startPrice,
        totalOwned: form.totalOwned
      }))
    } catch (e) {
      this.toastr.error('Unable to save Tracked Coin', 'Error')
      console.error(e)
      return
    }

    this.toastr.success('Successfully added Tracked Coin')
    this.updateState.emit()
    this.modal.hide()
  }

  cancelModal () {
    this.modal.hide()
  }

  getAvailableCoins () {
    return this.coinList.filter(v => !this.trackedCoins.map(v => v.coin).includes(v))
  }

  selectEvent (item: string) {
    this.coinSelector.clear()
    this.form.reset()
    this.form.get('coin')!.setValue(item)
    this.modal.show()
  }

  async removeCoin (item: TrackedCoin) {
    try {
      await firstValueFrom(this.settingsService.deleteTrackedCoin(item))
    } catch (e) {
      this.toastr.error('Unable to remove Tracked Coin', 'Error')
      console.error(e)
      return
    }

    this.toastr.success('Successfully removed Tracked Coin')
    this.updateState.emit()
  }
}
