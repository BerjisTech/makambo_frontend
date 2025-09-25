import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { firstValueFrom } from 'rxjs';
import { take } from 'rxjs/operators';
import { selectAuthToken } from '../../state/auth/auth.selectors';

export const authInterceptor: HttpInterceptorFn = async (req, next) => {
  const store = inject(Store);
  const token = await firstValueFrom(store.select(selectAuthToken).pipe(take(1)));

  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(req);
};
