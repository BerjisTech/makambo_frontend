import { ApplicationConfig } from '@angular/core';
import { provideRouter, Routes } from '@angular/router';
import { provideEffects } from '@ngrx/effects';
import { provideStore } from '@ngrx/store';
import { provideState } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { environment } from '../environments/environment';
import { authFeature } from './state/auth/auth.reducer';
import { AuthEffects } from './state/auth/auth.effects';
import { worldFeature } from './state/world/world.reducer';
import { WorldEffects } from './state/world/world.effects';
import { authGuard } from './core/guards/auth.guard';

export const appRoutes: Routes = [
  {
    path: 'auth',
    children: [
      {
        path: 'login',
        loadComponent: () => import('./features/auth/pages/login-page.component').then((m) => m.LoginPageComponent)
      },
      {
        path: 'register',
        loadComponent: () => import('./features/auth/pages/register-page.component').then((m) => m.RegisterPageComponent)
      }
    ]
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'dashboard'
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () => import('./features/dashboard/pages/dashboard-page.component').then((m) => m.DashboardPageComponent)
  },
  {
    path: 'world',
    canActivate: [authGuard],
    loadComponent: () => import('./features/world-map/pages/world-map-page.component').then((m) => m.WorldMapPageComponent)
  },
  {
    path: 'resources',
    canActivate: [authGuard],
    loadComponent: () => import('./features/resources/pages/resources-page.component').then((m) => m.ResourcesPageComponent)
  },
  {
    path: 'facilities',
    canActivate: [authGuard],
    loadComponent: () => import('./features/facilities/pages/facilities-page.component').then((m) => m.FacilitiesPageComponent)
  },
  {
    path: 'warfare',
    canActivate: [authGuard],
    loadComponent: () => import('./features/warfare/pages/warfare-page.component').then((m) => m.WarfarePageComponent)
  },
  {
    path: 'trade',
    canActivate: [authGuard],
    loadComponent: () => import('./features/trade/pages/trade-page.component').then((m) => m.TradePageComponent)
  },
  {
    path: 'diplomacy',
    canActivate: [authGuard],
    loadComponent: () => import('./features/diplomacy/pages/diplomacy-page.component').then((m) => m.DiplomacyPageComponent)
  },
  {
    path: 'research',
    canActivate: [authGuard],
    loadComponent: () => import('./features/research/pages/research-page.component').then((m) => m.ResearchPageComponent)
  },
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(appRoutes),
    provideStore(),
    provideState(authFeature),
    provideState(worldFeature),
    provideEffects([AuthEffects, WorldEffects]),
    ...(environment.production ? [] : [provideStoreDevtools({ maxAge: 25, trace: true })])
  ]
};
