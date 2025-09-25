import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap, tap } from 'rxjs';
import { AuthApiService } from '../../core/services/auth-api.service';
import { Player } from '../../models/player.model';
import { AuthActions } from './auth.actions';

const TOKEN_KEY = 'makambo.token';
const PLAYER_KEY = 'makambo.player';

@Injectable()
export class AuthEffects {
  constructor(
    private readonly actions$: Actions,
    private readonly authApi: AuthApiService,
    private readonly router: Router
  ) {}

  init$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.init),
      map(() => {
        const token = typeof window !== 'undefined' ? window.localStorage.getItem(TOKEN_KEY) : null;
        const playerRaw = typeof window !== 'undefined' ? window.localStorage.getItem(PLAYER_KEY) : null;
        if (token && playerRaw) {
          try {
            const player = JSON.parse(playerRaw) as Player;
            return AuthActions.loginSuccess({ accessToken: token, player });
          } catch (error) {
            console.error('Failed to parse player from storage', error);
            return AuthActions.logout();
          }
        }
        return AuthActions.logout();
      })
    )
  );

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      switchMap(({ email, password }) =>
        this.authApi.login(email, password).pipe(
          map((response) => AuthActions.loginSuccess(response)),
          catchError((error) => of(AuthActions.loginFailure({ error: error.message ?? 'Login failed' })))
        )
      )
    )
  );

  register$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.register),
      switchMap(({ email, password, displayName, countryId }) =>
        this.authApi.register(displayName, email, password, countryId).pipe(
          map((response) => AuthActions.registerSuccess(response)),
          catchError((error) => of(AuthActions.registerFailure({ error: error.message ?? 'Registration failed' })))
        )
      )
    )
  );

  persist$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.loginSuccess, AuthActions.registerSuccess),
        tap(({ accessToken, player }) => {
          if (typeof window !== 'undefined') {
            window.localStorage.setItem(TOKEN_KEY, accessToken);
            window.localStorage.setItem(PLAYER_KEY, JSON.stringify(player));
          }
        })
      ),
    { dispatch: false }
  );

  redirectOnSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.loginSuccess, AuthActions.registerSuccess),
        tap(() => {
          this.router.navigate(['/dashboard']);
        })
      ),
    { dispatch: false }
  );

  clearStorageOnLogout$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.logout),
        tap(() => {
          if (typeof window !== 'undefined') {
            window.localStorage.removeItem(TOKEN_KEY);
            window.localStorage.removeItem(PLAYER_KEY);
          }
          this.router.navigate(['/auth/login']);
        })
      ),
    { dispatch: false }
  );
}
