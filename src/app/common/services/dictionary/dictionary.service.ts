import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, of, switchMap, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DictionaryService {
  private dictionaries: { [key: string]: { value: number; label: string }[] } = {};

  constructor(private http: HttpClient) {}

  getDictionary(key: string): Observable<{ value: number; label: string }[]> {
    const value = this.dictionaries[key];

    if (!value) {
      return this.http.get<any[]>(`/api/dictionaries/${key}`).pipe(
        map((result) =>
          result.map((item) => ({
            value: item.id,
            label: item.name,
          }))
        ),
        tap((result) => (this.dictionaries[key] = result))
      );
    }
    return of(value);
  }
}
