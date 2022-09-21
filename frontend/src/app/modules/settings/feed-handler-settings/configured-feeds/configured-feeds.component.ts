import { Component, EventEmitter, Input, ViewChild } from '@angular/core'
import { FormBuilder, Validators } from '@angular/forms'
import { AutocompleteComponent } from 'angular-ng-autocomplete'
import { ToastrService } from 'ngx-toastr'
import { firstValueFrom } from 'rxjs'

import { FeedCategory, FeedHandler } from 'src/app/extra/models'
import { BaseFormComponent } from 'src/app/extra/base-form-component'
import { ModalComponent } from 'src/app/modules/shared/modal/modal.component'
import { SettingsService } from '../../settings.service'

@Component({
  selector: 'app-configured-feeds',
  templateUrl: './configured-feeds.component.html'
})
export class ConfiguredFeedsComponent extends BaseFormComponent {
  @Input() activeCategories: FeedCategory[] = []
  @Input() configuredFeeds: FeedHandler[] = []
  @Input() updateState: EventEmitter<null> = new EventEmitter<null>()

  @ViewChild('modal', { static: false }) modal!: ModalComponent
  @ViewChild('categorySelect', { static: false }) categorySelect!: AutocompleteComponent

  modalMode: 'edit' | 'add' = 'add'

  // Add/Edit Feed Handler form
  override form = this.formBuilder.group({
    id: null,
    name: [null, [Validators.required, Validators.minLength(3)]],
    url: [null, [Validators.required, Validators.minLength(3)]],
    categories: ['', [Validators.required, Validators.minLength(1)]],
    settings: ['{\n  \n}']
  })

  constructor (
    private toastr: ToastrService,
    private settingsService: SettingsService,
    public override formBuilder: FormBuilder
  ) {
    super(formBuilder)
  }

  removeFeedHandlerCategory (category: string) {
    const control: string[] = this.form.get('categories')!.value
    this.form.controls['categories'].setValue(control.filter(v => v !== category))
  }

  getFeedHandlerCategories () {
    const control: string[] = this.form.get('categories')!.value
    if (!control) return []
    return control
  }

  async sendAddFeedHandlerRequest () {
    const form = this.form.value

    // Send add request
    try {
      await firstValueFrom(this.settingsService.addFeedHandler({
        name: form.name,
        url: form.url,
        categories: form.categories,
        settings: form.settings
      }))
    } catch (e) {
      this.toastr.error('Unable to add Feed Handler', 'Error')
      console.error(e)
      return
    }

    this.toastr.success('Successfully added Feed Handler')
    this.updateState.emit()
    this.form.reset({ settings: '{\n  \n}' })
    this.modal.hide()
  }

  async sendEditFeedHandlerRequest () {
    const form = this.form.value

    // Send edit request
    try {
      await firstValueFrom(this.settingsService.editFeedHandler({
        id: form.id,
        name: form.name,
        url: form.url,
        categories: form.categories,
        settings: form.settings
      }))
    } catch (e) {
      this.toastr.error('Unable to edit Feed Handler', 'Error')
      console.error(e)
      return
    }

    this.toastr.success('Successfully edited Feed Handler')
    this.updateState.emit()
    this.modal.hide()
  }

  submitFeedHandlerModal () {
    // Ensure the form is valid
    if (!this.form.valid) {
      Object.keys(this.form.controls).forEach(field =>
        this.form.get(field)!.markAsDirty()
      )
      return
    }

    // Send edd/adit request
    switch (this.modalMode) {
      case 'edit':
        return this.sendEditFeedHandlerRequest()
      case 'add':
        return this.sendAddFeedHandlerRequest()
    }
  }

  feedHandlerCategorySelect (item: string) {
    let optionValue = this.form.controls['categories'].value
    if (!optionValue) optionValue = []
    optionValue.push(item)
    this.form.controls['categories'].setValue(optionValue)
    this.categorySelect.clear()
  }

  getCategories () {
    return this.activeCategories
      .map(v => v.name)
      .filter(v => !this.getFeedHandlerCategories().includes(v))
  }

  async deleteFeed (feed: FeedHandler) {
    try {
      await firstValueFrom(this.settingsService.deleteFeedHandler(feed))
    } catch (e) {
      this.toastr.error('Unable to delete Feed Handler', 'Error')
      console.error(e)
      return
    }

    this.toastr.success('Successfully removed Feed Handler')
    this.updateState.emit()
  }

  editFeed (feed: FeedHandler) {
    this.form.reset()
    this.modalMode = 'edit'

    // Load the form's data
    this.form.setValue({
      id: feed.id,
      name: feed.name,
      url: feed.url,
      categories: feed.categories,
      settings: typeof feed.settings === 'string' ? feed.settings : JSON.stringify(feed.settings)
      // settings: null // The data gets loaded after component init
    })

    // Show the modal
    this.modal.show()
  }

  addFeedHandler () {
    this.form.reset({ settings: '{\n  \n}' })
    this.modalMode = 'add'
    this.modal.show()
  }
}
