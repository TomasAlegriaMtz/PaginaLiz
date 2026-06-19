import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Document {
  _id: string;
  title: string;
  description?: string;
  filename: string;
  originalName: string;
  path: string;
  categoryId: any;
  uploaderId: any;
  uploadDate: string;
}

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  private apiUrl = `${environment.apiUrl}/documents`;

  constructor(private http: HttpClient) { }

  getDocuments(): Observable<Document[]> {
    return this.http.get<Document[]>(this.apiUrl);
  }

  uploadDocument(title: string, description: string, categoryId: string, file: File): Observable<Document> {
    const formData = new FormData();
    formData.append('title', title);
    if (description) {
      formData.append('description', description);
    }
    formData.append('categoryId', categoryId);
    formData.append('file', file);

    return this.http.post<Document>(this.apiUrl, formData);
  }

  deleteDocument(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  updateDocument(id: string, data: { title?: string; description?: string; categoryId?: string }): Observable<Document> {
    return this.http.put<Document>(`${this.apiUrl}/${id}`, data);
  }
}
