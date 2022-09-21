import { Component, EventEmitter, Input } from '@angular/core'
import { FormBuilder, Validators } from '@angular/forms'
import { ToastrService } from 'ngx-toastr'
import { firstValueFrom } from 'rxjs'

import { BaseFormComponent } from 'src/app/extra/base-form-component'
import { FeedCategory } from 'src/app/extra/models'
import { SettingsService } from '../../settings.service'

@Component({
  selector: 'app-feed-categories',
  templateUrl: './feed-categories.component.html'
})
export class FeedCategoriesComponent extends BaseFormComponent {
  @Input() activeCategories: FeedCategory[] = []
  @Input() updateState: EventEmitter<null> = new EventEmitter<null>()

  override form = this.formBuilder.group({
    category: [null, [Validators.required, Validators.minLength(3)]]
  })

  constructor (
    private toastr: ToastrService,
    private settingsService: SettingsService,
    public override formBuilder: FormBuilder
  ) {
    super(formBuilder)
  }

  async addCategory () {
    // Ensure the form is valid
    if (!this.form.valid) {
      Object.keys(this.form.controls).forEach(field =>
        this.form.get(field)!.markAsDirty()
      )
      return
    }

    // Ensure this is not a duplicate
    if (this.activeCategories.includes(this.form.value.category)) {
      this.toastr.error('This Category has already been created.', 'Error')
      return
    }

    // Send add request
    try {
      await firstValueFrom(this.settingsService.addFeedCategory(this.form.value.category))
    } catch (e) {
      this.toastr.error('Unable to add Feed Category', 'Error')
      console.error(e)
      return
    }

    this.toastr.success('Successfully added Feed Category')
    this.updateState.emit()
    this.form.reset()
  }

  async removeCategory (category: FeedCategory) {
    try {
      await firstValueFrom(this.settingsService.deleteFeedCategory(category))
    } catch (e) {
      this.toastr.error('Unable to delete Feed Category', 'Error')
      console.error(e)
      return
    }

    this.toastr.success('Successfully removed Feed Category')
    this.updateState.emit()
  }
}
