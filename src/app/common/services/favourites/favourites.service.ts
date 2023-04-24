import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Favourite } from './favourites.model';

@Injectable({
  providedIn: 'root',
})
export class FavouriteService {
  constructor(private http: HttpClient) {}

  getFavourites(userId: string): Observable<Favourite> {
    return this.http.get<Favourite>(`/api/favourites?id=${userId}`);
  }

  updateFavourites(favourite: Favourite): Observable<any> {
    return this.http.post(`/api/favourites`, favourite, { responseType: 'text' });
  }
}
