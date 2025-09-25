import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

@Component({
  standalone: true,
  selector: 'app-diplomacy-page',
  template: `
    <h1>Diplomacy & Alliances</h1>
    <mat-card>
      <h2>Alliance Network</h2>
      <p>List active alliances, membership, and charters here.</p>
    </mat-card>
    <mat-card>
      <h2>Embargoes</h2>
      <p>Track embargo zones and sanctions.</p>
    </mat-card>
  `,
  styles: [
    `
      mat-card {
        background: rgba(15, 23, 42, 0.85);
        margin-bottom: 1rem;
      }
    `
  ],
  imports: [MatCardModule],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DiplomacyPageComponent {}
