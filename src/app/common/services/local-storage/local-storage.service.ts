import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setItem(key: string, value: any): void {
    localStorage.setItem(key, JSON.stringify(value));
  }

  removeItem(key: string): void {
    localStorage.removeItem(key);
  }

  getItem<T>(key: string): T {
    if (localStorage.getItem(key)) {
      try {
        return JSON.parse(localStorage.getItem(key)) as T;
      } catch (e) {
        return localStorage.getItem(key) as T;
      }
    }
    return null;
  }
}

export function getCookie(cname: string): string {
  const name = cname + '=';
  const decodedCookie = decodeURIComponent(document.cookie);
  const ca = decodedCookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return '';
}
