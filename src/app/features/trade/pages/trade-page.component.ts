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
  selector: 'app-trade-page',
  template: `
    <h1>Trade & Economy</h1>
    <mat-card>
      <h2>Submit Trade Order</h2>
      <form [formGroup]="form" (ngSubmit)="submit()" class="form">
        <mat-form-field appearance="outline">
          <mat-label>Order Type</mat-label>
          <mat-select formControlName="type">
            <mat-option value="BUY">Buy</mat-option>
            <mat-option value="SELL">Sell</mat-option>
          </mat-select>
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Resource</mat-label>
          <input matInput formControlName="resourceId" />
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Quantity</mat-label>
          <input matInput type="number" formControlName="quantity" />
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Price per unit</mat-label>
          <input matInput type="number" formControlName="pricePerUnit" />
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Country</mat-label>
          <input matInput formControlName="countryId" />
        </mat-form-field>
        <button mat-flat-button color="primary" type="submit" [disabled]="form.invalid">Submit Order</button>
      </form>
      <pre *ngIf="lastOrder">{{ lastOrder | json }}</pre>
    </mat-card>
  `,
  styles: [
    `
      mat-card {
        background: rgba(30, 41, 59, 0.85);
      }
      .form {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1rem;
      }
    `
  ],
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule, MatCardModule],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TradePageComponent {
  private readonly fb = inject(FormBuilder);
  private readonly api = inject(ApiClientService);

  form = this.fb.nonNullable.group({
    type: ['BUY', Validators.required],
    resourceId: ['', Validators.required],
    quantity: [1, [Validators.required, Validators.min(0.1)]],
    pricePerUnit: [1, [Validators.required, Validators.min(0.1)]],
    countryId: ['', Validators.required]
  });

  lastOrder: unknown = null;

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const payload = this.form.getRawValue();
    this.api.createTradeOrder(payload).subscribe((order) => {
      this.lastOrder = order;
    });
  }
}
