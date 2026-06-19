import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';

export interface AuthResponse {
  _id: string;
  username: string;
  role: string;
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api/auth';
  private tokenKey = 'admin_token';
  
  public currentUser = signal<AuthResponse | null>(null);

  constructor(private http: HttpClient, private router: Router) {
    this.loadToken();
  }

  login(credentials: any) {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap(res => {
        if (res && res.token) {
          localStorage.setItem(this.tokenKey, res.token);
          this.currentUser.set(res);
        }
      })
    );
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
    this.currentUser.set(null);
    this.router.navigate(['/admin/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  private loadToken() {
    const token = this.getToken();
    if (token) {
      // Decode or just set as authenticated, for now we just keep the token
      this.currentUser.set({ token } as AuthResponse);
    }
  }
}
