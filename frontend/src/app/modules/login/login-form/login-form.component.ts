import { Component, OnDestroy, OnInit } from '@angular/core'
import { FormBuilder, Validators } from '@angular/forms'
import { Title } from '@angular/platform-browser'
import { Router } from '@angular/router'
import { firstValueFrom, Subscription } from 'rxjs'

import { BaseFormComponent } from 'src/app/extra/base-form-component'
import { HarperDBUser } from 'src/app/extra/harperdb'
import { environment } from 'src/environments/environment'
import { AuthStoreService } from '../../shared/auth-store.service'
import { AuthService } from '../../shared/auth.service'

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css']
})
export class LoginFormComponent extends BaseFormComponent implements OnInit, OnDestroy {
  subscriptions: Subscription[] = []
  loginError: string | null = null

  constructor (
    private title: Title,
    private router: Router,
    private authService: AuthService,
    private authStore: AuthStoreService,
    public override formBuilder: FormBuilder
  ) {
    super(formBuilder)
  }

  override form = this.formBuilder.group({
    username: [null, Validators.required],
    password: [null, Validators.required]
  })

  async submitForm () {
    if (!this.form.valid) {
      Object.keys(this.form.controls).forEach(field =>
        this.form.get(field)!.markAsDirty()
      )
      return
    }

    // Set Cookie to attempt to authenticate
    this.authService.setCookie(this.form.value)

    // Re-fetch auth state
    let result: HarperDBUser | boolean
    try {
      result = await firstValueFrom(this.authService.getUserInformation())
    } catch (_e) {
      result = false
    }

    // Update state
    if (result) {
      this.authStore.user = result
      this.authStore.authenticated = true
    } else {
      this.authStore.authenticated = false
    }

    // Once complete, check if we are authenticated
    if (this.authStore.authenticated) {
      this.router.navigate([
        this.authStore.lastLocation !== '' ? this.authStore.lastLocation : '/'
      ])
    } else {
      this.loginError = 'Invalid credentials provided.'
    }
  }

  ngOnDestroy () {
    this.subscriptions.map(sub => sub.unsubscribe())
  }

  ngOnInit () {
    this.title.setTitle('Login' + environment.titleTag)

    // If the User is already authenticated, navigate them to the home/last location
    this.subscriptions.push(
      this.authStore.authenticated$.subscribe(authenticated => {
        if (!authenticated) return
        this.router.navigate([
          this.authStore.lastLocation !== '' ? this.authStore.lastLocation : '/'
        ])
      })
    )
  }
}
