import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.html'
})
export class LoginComponent {
  credentials = { email: '', password: '' };
  errorMessage = '';
  
  private authService = inject(AuthService);
  private router = inject(Router);

  onSubmit() {
    this.authService.login(this.credentials).subscribe({
      next: () => {
        this.router.navigate(['/admin/documents']);
      },
      error: (err) => {
        this.errorMessage = 'Credenciales inválidas. Intenta de nuevo.';
      }
    });
  }
}
