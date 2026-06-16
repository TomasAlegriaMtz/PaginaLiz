import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AssetService {
  private apiUrl = 'http://localhost:3000/api/assets';

  constructor(private http: HttpClient) { }

  uploadAsset(file: File): Observable<{ url: string; filename: string; originalName: string }> {
    const formData = new FormData();
    formData.append('image', file);

    const token = localStorage.getItem('token');
    return this.http.post<any>(`${this.apiUrl}/upload`, formData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  deleteAsset(filename: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.delete<any>(`${this.apiUrl}/${filename}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }
}
