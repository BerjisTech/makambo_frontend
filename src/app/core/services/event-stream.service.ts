import { Injectable, OnDestroy } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable, Subject } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class EventStreamService implements OnDestroy {
  private socket: Socket;
  private readonly disconnect$ = new Subject<void>();

  constructor() {
    this.socket = io(environment.wsUrl, { transports: ['websocket'] });
  }

  listen<T>(event: string): Observable<T> {
    return new Observable((subscriber) => {
      const handler = (payload: T) => subscriber.next(payload);
      this.socket.on(event, handler);
      return () => this.socket.off(event, handler);
    });
  }

  emit(event: string, payload?: unknown) {
    this.socket.emit(event, payload);
  }

  ngOnDestroy() {
    this.disconnect$.next();
    this.disconnect$.complete();
    this.socket.disconnect();
  }
}
