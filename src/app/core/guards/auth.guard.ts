import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { map, take, tap } from 'rxjs';
import { selectIsAuthenticated } from '../../state/auth/auth.selectors';

export const authGuard: CanActivateFn = () => {
  const store = inject(Store);
  const router = inject(Router);

  return store.select(selectIsAuthenticated).pipe(
    take(1),
    tap((isAuthed) => {
      if (!isAuthed) {
        router.navigate(['/auth/login']);
      }
    }),
    map((isAuthed) => isAuthed)
  );
};
