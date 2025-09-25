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
  selector: 'app-facilities-page',
  template: `
    <h1>Facility Construction</h1>
    <form class="form" [formGroup]="form" (ngSubmit)="submit()">
      <mat-form-field appearance="outline">
        <mat-label>Facility Type</mat-label>
        <mat-select formControlName="type">
          <mat-option value="FURNACE">Furnace</mat-option>
          <mat-option value="STEEL_MILL">Steel Mill</mat-option>
          <mat-option value="REFINERY">Refinery</mat-option>
          <mat-option value="MACHINE_SHOP">Machine Shop</mat-option>
          <mat-option value="LAB">Research Lab</mat-option>
        </mat-select>
      </mat-form-field>
      <mat-form-field appearance="outline">
        <mat-label>Location</mat-label>
        <input matInput formControlName="locationId" />
      </mat-form-field>
      <mat-form-field appearance="outline">
        <mat-label>Country</mat-label>
        <input matInput formControlName="countryId" />
      </mat-form-field>
      <mat-form-field appearance="outline">
        <mat-label>Input Lot IDs (comma separated)</mat-label>
        <input matInput formControlName="inputLotIds" />
      </mat-form-field>
      <button mat-flat-button color="primary" type="submit" [disabled]="form.invalid">Queue Construction</button>
    </form>
    <mat-card *ngIf="lastResponse">
      <h2>Last Response</h2>
      <pre>{{ lastResponse | json }}</pre>
    </mat-card>
  `,
  styles: [
    `
      .form {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1rem;
        margin-bottom: 1.5rem;
      }
      mat-card {
        background: rgba(30, 41, 59, 0.85);
      }
    `
  ],
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatCardModule, MatSelectModule],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FacilitiesPageComponent {
  private readonly fb = inject(FormBuilder);
  private readonly api = inject(ApiClientService);

  form = this.fb.nonNullable.group({
    type: ['', Validators.required],
    locationId: ['', Validators.required],
    countryId: ['', Validators.required],
    inputLotIds: ['lot-1,lot-2']
  });

  lastResponse: unknown = null;

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const payload = {
      ...this.form.getRawValue(),
      inputLotIds: this.form.getRawValue().inputLotIds.split(',').map((id) => id.trim()).filter(Boolean)
    };
    this.api.createFacility(payload).subscribe((response) => {
      this.lastResponse = response;
    });
  }
}
