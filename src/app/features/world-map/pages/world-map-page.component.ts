import { AsyncPipe, NgIf } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
  inject
} from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { Store } from '@ngrx/store';
import type { FeatureCollection, Polygon } from 'geojson';
import mapboxgl from 'mapbox-gl';
import { Subject, takeUntil } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ResourceDeposit } from '../../../models/world-state.model';
import { WorldActions } from '../../../state/world/world.actions';
import { selectDeposits, selectWorldData, selectWorldStatus } from '../../../state/world/world.selectors';

@Component({
  standalone: true,
  selector: 'app-world-map-page',
  imports: [NgIf, AsyncPipe, MatCardModule],
  template: `
    <h1>World Map</h1>
    <p class="subtitle">Interact with live resource overlays and conflict zones.</p>
    <mat-card class="map-card">
      <div #mapContainer class="map"></div>
      <div class="status" *ngIf="status$ | async as status">
        Status: {{ status }}
      </div>
    </mat-card>
  `,
  styles: [
    `
      .map-card {
        position: relative;
        height: 520px;
        background: rgba(23, 37, 84, 0.6);
      }
      .map {
        width: 100%;
        height: 100%;
      }
      .subtitle {
        margin-bottom: 1rem;
        color: #94a3b8;
      }
      .status {
        position: absolute;
        bottom: 1rem;
        right: 1rem;
        background: rgba(15, 23, 42, 0.8);
        padding: 0.5rem 1rem;
        border-radius: 999px;
        font-size: 0.875rem;
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WorldMapPageComponent implements OnInit, AfterViewInit, OnDestroy {
  private readonly store = inject(Store);
  private readonly destroy$ = new Subject<void>();
  private map?: mapboxgl.Map;
  private mapLoaded = false;

  @ViewChild('mapContainer', { static: true })
  private readonly mapContainer!: ElementRef<HTMLDivElement>;

  world$ = this.store.select(selectWorldData);
  deposits$ = this.store.select(selectDeposits);
  status$ = this.store.select(selectWorldStatus);

  ngOnInit() {
    mapboxgl.accessToken = environment.mapboxToken;
    this.store.dispatch(WorldActions.load());
  }

  ngAfterViewInit() {
    this.map = new mapboxgl.Map({
      container: this.mapContainer.nativeElement,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [0, 20],
      zoom: 1.5
    });

    this.map.addControl(new mapboxgl.NavigationControl({ visualizePitch: true }), 'top-right');

    this.map.on('load', () => {
      this.mapLoaded = true;
      this.deposits$.pipe(takeUntil(this.destroy$)).subscribe((deposits) => {
        this.renderDeposits(deposits ?? []);
      });
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.map?.remove();
  }

  private renderDeposits(deposits: ResourceDeposit[]) {
    if (!this.map || !this.mapLoaded) {
      return;
    }

    const features = deposits
      .filter((deposit) => deposit.polygon && deposit.polygon.length >= 3)
      .map((deposit) => {
        const coordinates = deposit.polygon.map((point) => [point.longitude, point.latitude]);
        if (coordinates.length > 0) {
          const first = coordinates[0];
          const last = coordinates[coordinates.length - 1];
          if (first[0] !== last[0] || first[1] !== last[1]) {
            coordinates.push(first);
          }
        }
        return {
          type: 'Feature' as const,
          properties: {
            id: deposit.id,
            type: deposit.type,
            remaining: deposit.remaining
          },
          geometry: {
            type: 'Polygon' as const,
            coordinates: [coordinates]
          }
        };
      });

    const geoJson: FeatureCollection<Polygon> = {
      type: 'FeatureCollection',
      features
    };

    if (this.map.getSource('deposits')) {
      const source = this.map.getSource('deposits') as mapboxgl.GeoJSONSource;
      source.setData(geoJson);
    } else {
      this.map.addSource('deposits', {
        type: 'geojson',
        data: geoJson
      });

      this.map.addLayer({
        id: 'deposits-fill',
        type: 'fill',
        source: 'deposits',
        paint: {
          'fill-color': [
            'match',
            ['get', 'type'],
            'IRON', '#60a5fa',
            'OIL', '#f97316',
            'BAUXITE', '#facc15',
            'URANIUM', '#86efac',
            'RARE_EARTH', '#f472b6',
            '#f59e0b'
          ],
          'fill-opacity': 0.35
        }
      });

      this.map.addLayer({
        id: 'deposits-outline',
        type: 'line',
        source: 'deposits',
        paint: {
          'line-color': '#e2e8f0',
          'line-width': 1.2
        }
      });
    }
  }
}
