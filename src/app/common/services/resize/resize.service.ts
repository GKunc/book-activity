import { Injectable } from '@angular/core';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ResizeService {
  _isSmall$ = new BehaviorSubject<boolean>(null);
  isSmall$ = this._isSmall$.asObservable();

  constructor(public breakpointObserver: BreakpointObserver) {
    this.breakpointObserver.observe(['(min-width: 575px)']).subscribe((state: BreakpointState) => {
      if (state.matches) {
        this._isSmall$.next(false);
      } else {
        this._isSmall$.next(true);
      }
    });
  }
}
