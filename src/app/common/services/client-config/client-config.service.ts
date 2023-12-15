import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ClienntConfigService {
  constructor(private http: HttpClient) {}

  getUserConfig(): void {
    console.log('get');
  }

  setConfig(): void {
    console.log('set');
  }
}
