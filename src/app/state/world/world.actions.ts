import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { WorldStateData } from '../../models/world-state.model';

export const WorldActions = createActionGroup({
  source: 'World',
  events: {
    Load: emptyProps(),
    Refresh: emptyProps(),
    LoadSuccess: props<{ state: WorldStateData }>(),
    LoadFailure: props<{ error: string }>(),
    SelectDeposit: props<{ depositId: string | null }>()
  }
});
