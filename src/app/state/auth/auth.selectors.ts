import { createSelector } from '@ngrx/store';
import { authFeature } from './auth.reducer';

export const selectAuth = authFeature.selectAuthState;
export const selectAuthPlayer = authFeature.selectPlayer;
export const selectAuthToken = authFeature.selectToken;
export const selectAuthStatus = authFeature.selectStatus;
export const selectAuthError = authFeature.selectError;

export const selectIsAuthenticated = createSelector(selectAuthToken, (token) => !!token);
