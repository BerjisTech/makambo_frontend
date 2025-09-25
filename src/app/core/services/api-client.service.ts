import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { WorldStateData } from '../../models/world-state.model';

@Injectable({ providedIn: 'root' })
export class ApiClientService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;

  getWorldState(): Observable<WorldStateData> {
    return this.http.get<WorldStateData>(`${this.baseUrl}/world/state`);
  }

  getCountryInventory(countryId: string): Observable<{ countryId: string; lots: unknown[] }> {
    return this.http.get<{ countryId: string; lots: unknown[] }>(`${this.baseUrl}/resources/inventory/${countryId}`);
  }

  createMiningJob(payload: unknown): Observable<unknown> {
    return this.http.post(`${this.baseUrl}/resources/mine`, payload);
  }

  createCraftJob(payload: unknown): Observable<unknown> {
    return this.http.post(`${this.baseUrl}/resources/craft`, payload);
  }

  createFacility(payload: unknown): Observable<unknown> {
    return this.http.post(`${this.baseUrl}/facilities`, payload);
  }

  planOperation(payload: unknown): Observable<unknown> {
    return this.http.post(`${this.baseUrl}/warfare/operations`, payload);
  }

  launchMissile(payload: unknown): Observable<unknown> {
    return this.http.post(`${this.baseUrl}/warfare/missiles`, payload);
  }

  launchNuke(payload: unknown): Observable<unknown> {
    return this.http.post(`${this.baseUrl}/warfare/nukes`, payload);
  }

  createTradeOrder(payload: unknown): Observable<unknown> {
    return this.http.post(`${this.baseUrl}/trade/orders`, payload);
  }
}
