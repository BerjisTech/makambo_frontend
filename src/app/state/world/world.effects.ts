import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap, takeUntil } from 'rxjs';
import { ApiClientService } from '../../core/services/api-client.service';
import { EventStreamService } from '../../core/services/event-stream.service';
import { AuthActions } from '../auth/auth.actions';
import { WorldActions } from './world.actions';

@Injectable()
export class WorldEffects {
  constructor(
    private readonly actions$: Actions,
    private readonly apiClient: ApiClientService,
    private readonly events: EventStreamService
  ) {}

  loadWorld$ = createEffect(() =>
    this.actions$.pipe(
      ofType(WorldActions.load, WorldActions.refresh),
      switchMap(() =>
        this.apiClient.getWorldState().pipe(
          map((state) => WorldActions.loadSuccess({ state })),
          catchError((error) => of(WorldActions.loadFailure({ error: error.message ?? 'Failed to load world' })))
        )
      )
    )
  );

  listenForWorldUpdates$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.loginSuccess),
      switchMap(() =>
        this.events.listen('world.update').pipe(
          map(() => WorldActions.refresh()),
          takeUntil(this.actions$.pipe(ofType(AuthActions.logout)))
        )
      )
    )
  );
}
