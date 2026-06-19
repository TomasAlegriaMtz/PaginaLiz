import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface LangFile {
  filename: string;
  originalName: string;
  path: string;
}

export interface Document {
  _id: string;
  title: string;
  description?: string;
  es?: LangFile | null;
  en?: LangFile | null;
  categoryId: any;
  uploaderId: any;
  uploadDate: string;
}

export interface DocumentTextResponse {
  content: string;
  lang: string;
  extractedAt: string;
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

  uploadDocument(title: string, description: string, categoryId: string, file: File, lang: string = 'es'): Observable<Document> {
    const formData = new FormData();
    formData.append('title', title);
    if (description) {
      formData.append('description', description);
    }
    formData.append('categoryId', categoryId);
    formData.append('lang', lang);
    formData.append('file', file);

    return this.http.post<Document>(this.apiUrl, formData);
  }

  uploadDocumentLang(id: string, file: File, lang: string): Observable<Document> {
    const formData = new FormData();
    formData.append('lang', lang);
    formData.append('file', file);

    return this.http.post<Document>(`${this.apiUrl}/${id}/lang`, formData);
  }

  getDocumentText(id: string, lang: string = 'es'): Observable<DocumentTextResponse> {
    return this.http.get<DocumentTextResponse>(`${this.apiUrl}/${id}/text?lang=${lang}`);
  }

  deleteDocument(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  deleteDocumentLang(id: string, lang: string): Observable<Document> {
    return this.http.delete<Document>(`${this.apiUrl}/${id}/lang/${lang}`);
  }

  updateDocument(id: string, data: { title?: string; description?: string; categoryId?: string }): Observable<Document> {
    return this.http.put<Document>(`${this.apiUrl}/${id}`, data);
  }
}
