import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

export interface User {
  _id: string;
  username: string;
  role: 'MASTER' | 'ADMIN';
  isActive: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private apiUrl = 'http://localhost:3000/api/users';

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  createUser(data: { username: string, password: string, role: string }): Observable<any> {
    return this.http.post(this.apiUrl, data, { headers: this.getHeaders() });
  }

  toggleStatus(id: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${id}/toggle`, {}, { headers: this.getHeaders() });
  }
}
