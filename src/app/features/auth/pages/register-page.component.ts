import { AsyncPipe, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AuthActions } from '../../../state/auth/auth.actions';
import { selectAuthError, selectAuthStatus } from '../../../state/auth/auth.selectors';

@Component({
  standalone: true,
  selector: 'app-register-page',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    RouterLink,
    AsyncPipe,
    NgIf
  ],
  template: `
    <section class="auth-shell">
      <mat-card>
        <h1>Request Access</h1>
        <form [formGroup]="form" (ngSubmit)="submit()">
          <mat-form-field appearance="outline">
            <mat-label>Display Name</mat-label>
            <input matInput formControlName="displayName" />
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Email</mat-label>
            <input matInput formControlName="email" type="email" />
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Password</mat-label>
            <input matInput formControlName="password" type="password" />
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Country ID</mat-label>
            <input matInput formControlName="countryId" />
          </mat-form-field>
          <button mat-flat-button color="primary" type="submit" [disabled]="form.invalid || (status$ | async) === 'loading'">
            Register
          </button>
        </form>
        <p class="error" *ngIf="error$ | async as error">{{ error }}</p>
        <p class="link">Already have clearance? <a routerLink="/auth/login">Sign in</a></p>
      </mat-card>
    </section>
  `,
  styles: [
    `
      .auth-shell {
        min-height: 100vh;
        display: grid;
        place-items: center;
        background: radial-gradient(circle at top, rgba(30, 64, 175, 0.2), #020617 70%);
      }
      mat-card {
        width: min(480px, 90vw);
        padding: 2rem;
        background: rgba(15, 23, 42, 0.9);
        color: #e2e8f0;
      }
      form {
        display: grid;
        gap: 1rem;
        margin-top: 1rem;
      }
      .error {
        color: #f87171;
      }
      .link {
        margin-top: 1.5rem;
        text-align: center;
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RegisterPageComponent {
  private readonly store = inject(Store);
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);

  form = this.fb.nonNullable.group({
    displayName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    countryId: ['', Validators.required]
  });

  status$: Observable<string> = this.store.select(selectAuthStatus);
  error$: Observable<string | null> = this.store.select(selectAuthError);

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const { displayName, email, password, countryId } = this.form.getRawValue();
    this.store.dispatch(AuthActions.register({ displayName, email, password, countryId }));
  }
}
