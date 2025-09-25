import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ApiClientService } from '../../../core/services/api-client.service';

@Component({
  standalone: true,
  selector: 'app-warfare-page',
  template: `
    <h1>Warfare Operations</h1>
    <p>Plan operations, launch missiles, and manage high-risk actions.</p>
    <mat-card>
      <h2>Plan Operation</h2>
      <form [formGroup]="operationForm" (ngSubmit)="planOperation()" class="form">
        <mat-form-field appearance="outline">
          <mat-label>Type</mat-label>
          <mat-select formControlName="type">
            <mat-option value="OFFENSIVE">Offensive</mat-option>
            <mat-option value="DEFENSIVE">Defensive</mat-option>
            <mat-option value="SABOTAGE">Sabotage</mat-option>
          </mat-select>
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Origin Country</mat-label>
          <input matInput formControlName="originCountryId" />
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Target Region</mat-label>
          <input matInput formControlName="targetRegionId" />
        </mat-form-field>
        <button mat-flat-button color="accent" type="submit">Queue Operation</button>
      </form>
      <pre *ngIf="operationResult">{{ operationResult | json }}</pre>
    </mat-card>
  `,
  styles: [
    `
      mat-card {
        background: rgba(15, 23, 42, 0.8);
        margin-bottom: 1.5rem;
      }
      .form {
        display: grid;
        gap: 1rem;
        grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      }
    `
  ],
  imports: [ReactiveFormsModule, MatCardModule, MatFormFieldModule, MatSelectModule, MatInputModule, MatButtonModule],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WarfarePageComponent {
  private readonly fb = inject(FormBuilder);
  private readonly api = inject(ApiClientService);

  operationForm = this.fb.nonNullable.group({
    type: ['OFFENSIVE', Validators.required],
    originCountryId: ['', Validators.required],
    targetRegionId: ['', Validators.required]
  });

  operationResult: unknown = null;

  planOperation() {
    if (this.operationForm.invalid) {
      this.operationForm.markAllAsTouched();
      return;
    }
    const payload = {
      ...this.operationForm.getRawValue(),
      units: []
    };
    this.api.planOperation(payload).subscribe((result) => {
      this.operationResult = result;
    });
  }
}
