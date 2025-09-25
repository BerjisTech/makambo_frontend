import { createSelector } from '@ngrx/store';
import { worldFeature } from './world.reducer';

export const selectWorld = worldFeature.selectWorldState;
export const selectWorldData = worldFeature.selectData;
export const selectWorldStatus = worldFeature.selectStatus;
export const selectWorldError = worldFeature.selectError;
export const selectWorldSelectedDeposit = worldFeature.selectSelectedDepositId;

export const selectDeposits = createSelector(selectWorldData, (data) => data?.deposits ?? []);
export const selectConflicts = createSelector(selectWorldData, (data) => data?.conflicts ?? []);
export const selectTradeOrders = createSelector(selectWorldData, (data) => data?.tradeOrders ?? []);
export const selectBorders = createSelector(selectWorldData, (data) => data?.borders ?? []);
