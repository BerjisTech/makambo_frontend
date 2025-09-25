import { AsyncPipe, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Player } from './models/player.model';
import { AuthActions } from './state/auth/auth.actions';
import { selectAuthPlayer, selectIsAuthenticated } from './state/auth/auth.selectors';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    AsyncPipe,
    NgIf,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    MatListModule
  ],
  template: `
    <ng-container *ngIf="isAuthenticated$ | async; else authRoutes">
      <mat-sidenav-container class="layout">
        <mat-sidenav #drawer mode="side" opened>
          <mat-nav-list>
            <a mat-list-item routerLink="/dashboard" routerLinkActive="active">Dashboard</a>
            <a mat-list-item routerLink="/world" routerLinkActive="active">World Map</a>
            <a mat-list-item routerLink="/resources" routerLinkActive="active">Resources</a>
            <a mat-list-item routerLink="/facilities" routerLinkActive="active">Facilities</a>
            <a mat-list-item routerLink="/warfare" routerLinkActive="active">Warfare</a>
            <a mat-list-item routerLink="/trade" routerLinkActive="active">Trade</a>
            <a mat-list-item routerLink="/diplomacy" routerLinkActive="active">Diplomacy</a>
            <a mat-list-item routerLink="/research" routerLinkActive="active">Research</a>
          </mat-nav-list>
        </mat-sidenav>
        <mat-sidenav-content>
          <mat-toolbar color="primary">
            <button mat-icon-button (click)="drawer.toggle()" class="menu-btn">
              <mat-icon>menu</mat-icon>
            </button>
            <span class="flex"></span>
            <ng-container *ngIf="player$ | async as player">
              <span class="player-name">{{ player.displayName }} ({{ player.rank }})</span>
              <button mat-button (click)="logout()">Logout</button>
            </ng-container>
          </mat-toolbar>
          <main class="content">
            <router-outlet></router-outlet>
          </main>
        </mat-sidenav-content>
      </mat-sidenav-container>
    </ng-container>
    <ng-template #authRoutes>
      <router-outlet></router-outlet>
    </ng-template>
  `,
  styles: [
    `
      .layout {
        height: 100vh;
      }
      .content {
        padding: 1.5rem;
        height: calc(100vh - 64px);
        overflow: auto;
        background: #0f172a;
        color: #e2e8f0;
      }
      mat-sidenav {
        width: 240px;
      }
      .menu-btn {
        margin-right: 1rem;
      }
      a.active {
        font-weight: 600;
      }
      .flex {
        flex: 1;
      }
      .player-name {
        margin-right: 1rem;
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {
  private readonly store = inject(Store);

  isAuthenticated$: Observable<boolean> = this.store.select(selectIsAuthenticated);
  player$: Observable<Player | null> = this.store.select(selectAuthPlayer);

  ngOnInit(): void {
    this.store.dispatch(AuthActions.init());
  }

  logout(): void {
    this.store.dispatch(AuthActions.logout());
  }
}
