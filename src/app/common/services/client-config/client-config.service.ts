import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ClienntConfigService {
  getConfig(): void {
    console.log('get');
  }

  setConfig(): void {
    console.log('set');
  }
}
