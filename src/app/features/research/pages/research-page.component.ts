import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@Component({
  standalone: true,
  selector: 'app-research-page',
  template: `
    <h1>Research & Development</h1>
    <mat-card>
      <h2>Knowledge Domains</h2>
      <div class="domain" *ngFor="let domain of domains">
        <span>{{ domain.name }}</span>
        <mat-progress-bar mode="determinate" [value]="domain.progress"></mat-progress-bar>
      </div>
    </mat-card>
  `,
  styles: [
    `
      mat-card {
        background: rgba(30, 41, 59, 0.85);
      }
      .domain {
        display: flex;
        align-items: center;
        gap: 1rem;
        margin-bottom: 1rem;
      }
      mat-progress-bar {
        flex: 1;
      }
    `
  ],
  imports: [MatCardModule, MatProgressBarModule],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResearchPageComponent {
  domains = [
    { name: 'Metallurgy', progress: 20 },
    { name: 'Rocketry', progress: 5 },
    { name: 'Electronics', progress: 0 }
  ];
}
