import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Player } from '../../models/player.model';

export const AuthActions = createActionGroup({
  source: 'Auth',
  events: {
    Init: emptyProps(),
    Login: props<{ email: string; password: string }>(),
    LoginSuccess: props<{ accessToken: string; player: Player }>(),
    LoginFailure: props<{ error: string }>(),
    Register: props<{ email: string; password: string; displayName: string; countryId: string }>(),
    RegisterSuccess: props<{ accessToken: string; player: Player }>(),
    RegisterFailure: props<{ error: string }>(),
    Logout: emptyProps(),
    ClearError: emptyProps()
  }
});
