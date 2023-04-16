import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ActivityComment } from "./comments.model";

@Injectable({
    providedIn: 'root'
})
export class CommentsService {
    constructor(private http: HttpClient) { }
  
    getComments(activityId: string): Observable<ActivityComment[]> {
        const params = new HttpParams()
            .append('activityId', activityId)
      return this.http.get<ActivityComment[]>(`/api/comments`, { params });
    }

    addComment(comment: ActivityComment): Observable<any> {
        return this.http.post(`/api/comments`, comment, { responseType: 'text' });
    }
}