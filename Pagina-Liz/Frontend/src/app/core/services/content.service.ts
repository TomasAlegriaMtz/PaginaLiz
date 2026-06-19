import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface PageContent {
  _id: string;
  slug: string;
  data: any;
  updatedAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class ContentService {
  private apiUrl = `${environment.apiUrl}/content`;

  constructor(private http: HttpClient) {}

  getContent(slug: string): Observable<PageContent> {
    return this.http.get<PageContent>(`${this.apiUrl}/${slug}`);
  }

  updateContent(slug: string, data: any): Observable<PageContent> {
    return this.http.put<PageContent>(`${this.apiUrl}/${slug}`, { data });
  }
}
