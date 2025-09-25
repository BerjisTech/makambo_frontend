import { createFeature, createReducer, on } from '@ngrx/store';
import { Player } from '../../models/player.model';
import { AuthActions } from './auth.actions';

export interface AuthState {
  player: Player | null;
  token: string | null;
  status: 'idle' | 'loading' | 'authenticated';
  error: string | null;
}

const initialState: AuthState = {
  player: null,
  token: null,
  status: 'idle',
  error: null
};

export const authFeature = createFeature({
  name: 'auth',
  reducer: createReducer(
    initialState,
    on(AuthActions.init, (state) => ({ ...state, status: 'loading' })),
    on(AuthActions.login, AuthActions.register, (state) => ({ ...state, status: 'loading', error: null })),
    on(AuthActions.loginSuccess, AuthActions.registerSuccess, (state, { accessToken, player }) => ({
      ...state,
      player,
      token: accessToken,
      status: 'authenticated',
      error: null
    })),
    on(AuthActions.loginFailure, AuthActions.registerFailure, (state, { error }) => ({
      ...state,
      status: 'idle',
      error
    })),
    on(AuthActions.logout, () => initialState),
    on(AuthActions.clearError, (state) => ({ ...state, error: null }))
  )
});

export const {
  name: authFeatureKey,
  reducer: authReducer,
  selectAuthState,
  selectPlayer,
  selectToken,
  selectStatus,
  selectError
} = authFeature;
