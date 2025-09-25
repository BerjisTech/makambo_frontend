import { createFeature, createReducer, on } from '@ngrx/store';
import { WorldStateData } from '../../models/world-state.model';
import { WorldActions } from './world.actions';

export interface WorldState {
  data: WorldStateData | null;
  status: 'idle' | 'loading' | 'loaded' | 'error';
  error: string | null;
  selectedDepositId: string | null;
}

const initialState: WorldState = {
  data: null,
  status: 'idle',
  error: null,
  selectedDepositId: null
};

export const worldFeature = createFeature({
  name: 'world',
  reducer: createReducer(
    initialState,
    on(WorldActions.load, WorldActions.refresh, (state) => ({ ...state, status: 'loading', error: null })),
    on(WorldActions.loadSuccess, (state, { state: data }) => ({
      ...state,
      data,
      status: 'loaded',
      error: null
    })),
    on(WorldActions.loadFailure, (state, { error }) => ({
      ...state,
      status: 'error',
      error
    })),
    on(WorldActions.selectDeposit, (state, { depositId }) => ({
      ...state,
      selectedDepositId: depositId
    }))
  )
});

export const {
  name: worldFeatureKey,
  reducer: worldReducer,
  selectWorldState,
  selectData,
  selectStatus,
  selectError,
  selectSelectedDepositId
} = worldFeature;
