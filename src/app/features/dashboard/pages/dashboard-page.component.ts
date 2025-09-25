import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { WorldStateData } from '../../../models/world-state.model';
import { WorldActions } from '../../../state/world/world.actions';
import { selectConflicts, selectDeposits, selectWorldData, selectWorldStatus } from '../../../state/world/world.selectors';

@Component({
  standalone: true,
  selector: 'app-dashboard-page',
  template: `
    <h1>Operational Overview</h1>
    <p class="subtitle">Track your country's performance at a glance.</p>
    <section class="grid" *ngIf="worldState$ | async as worldState; else loading">
      <mat-card>
        <h2>Active Conflicts</h2>
        <p>{{ (conflicts$ | async)?.length ?? 0 }}</p>
      </mat-card>
      <mat-card>
        <h2>Resource Deposits</h2>
        <p>{{ (deposits$ | async)?.length ?? 0 }}</p>
      </mat-card>
      <mat-card>
        <h2>Trade Orders</h2>
        <p>{{ worldState.tradeOrders.length }}</p>
      </mat-card>
    </section>
    <ng-template #loading>
      <p class="loading">{{ status$ | async }}...</p>
    </ng-template>
    <section *ngIf="worldState$ | async as world">
      <h2>Recent Conflicts</h2>
      <ul>
        <li *ngFor="let conflict of world.conflicts">
          {{ conflict.type }} @ {{ conflict.regionId }} — status: {{ conflict.status }}
        </li>
      </ul>
    </section>
  `,
  styles: [
    `
      :host {
        display: block;
      }
      .subtitle {
        margin-bottom: 1.5rem;
        color: #94a3b8;
      }
      .grid {
        display: grid;
        gap: 1rem;
        grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
        margin-bottom: 2rem;
      }
      mat-card {
        background: rgba(148, 163, 184, 0.08);
        color: inherit;
      }
      .loading {
        color: #94a3b8;
      }
    `
  ],
  imports: [NgIf, NgFor, AsyncPipe, MatCardModule],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardPageComponent implements OnInit {
  private readonly store = inject(Store);

  worldState$: Observable<WorldStateData | null> = this.store.select(selectWorldData);
  status$: Observable<string> = this.store.select(selectWorldStatus);
  deposits$ = this.store.select(selectDeposits);
  conflicts$ = this.store.select(selectConflicts);

  ngOnInit() {
    this.store.dispatch(WorldActions.load());
  }
}
