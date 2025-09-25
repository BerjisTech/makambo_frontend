import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Store } from '@ngrx/store';
import { Observable, Subject, startWith, switchMap, takeUntil } from 'rxjs';
import { ApiClientService } from '../../../core/services/api-client.service';
import { Player } from '../../../models/player.model';
import { selectAuthPlayer } from '../../../state/auth/auth.selectors';

@Component({
  standalone: true,
  selector: 'app-resources-page',
  template: `
    <h1>Resources</h1>
    <form class="form" [formGroup]="inventoryForm" (ngSubmit)="fetchInventory()">
      <mat-form-field appearance="outline">
        <mat-label>Country ID</mat-label>
        <input matInput formControlName="countryId" />
      </mat-form-field>
      <button mat-flat-button color="primary" type="submit">Load Inventory</button>
    </form>

    <mat-card *ngIf="inventory$ | async as inventory">
      <h2>Inventory Lots</h2>
      <ng-container *ngIf="inventory.lots?.length; else noLots">
        <ul>
          <li *ngFor="let lot of inventory.lots">{{ lot | json }}</li>
        </ul>
      </ng-container>
      <ng-template #noLots>
        <p>No lots available yet.</p>
      </ng-template>
    </mat-card>
  `,
  styles: [
    `
      .form {
        display: flex;
        gap: 1rem;
        align-items: center;
        margin-bottom: 1.5rem;
      }
      mat-card {
        background: rgba(15, 23, 42, 0.85);
      }
    `
  ],
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatCardModule, NgIf, NgFor, AsyncPipe],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResourcesPageComponent implements OnInit, OnDestroy {
  private readonly fb = inject(FormBuilder);
  private readonly api = inject(ApiClientService);
  private readonly store = inject(Store);
  private readonly destroy$ = new Subject<void>();

  inventoryForm = this.fb.group({
    countryId: this.fb.control('')
  });

  inventory$: Observable<any> = this.inventoryForm.valueChanges.pipe(
    startWith(this.inventoryForm.value),
    switchMap((value) => this.api.getCountryInventory(value.countryId ?? ''))
  );

  ngOnInit() {
    this.store
      .select(selectAuthPlayer)
      .pipe(takeUntil(this.destroy$))
      .subscribe((player: Player | null) => {
        if (player?.countryId) {
          this.inventoryForm.patchValue({ countryId: player.countryId }, { emitEvent: true });
        }
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  fetchInventory() {
    if (this.inventoryForm.invalid) {
      return;
    }
    this.inventoryForm.updateValueAndValidity({ onlySelf: false, emitEvent: true });
  }
}
