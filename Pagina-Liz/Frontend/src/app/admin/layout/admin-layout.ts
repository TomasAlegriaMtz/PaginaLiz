import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="admin-shell">
      <nav class="admin-topbar">
        <a class="brand" routerLink="/admin">Panel de Administración</a>
        <ul class="nav-links">
          <li><a routerLink="/admin/documents" routerLinkActive="active">Documentos y Materias</a></li>
          <li><a routerLink="/admin/cms-home" routerLinkActive="active">Contenido</a></li>
          <li><a routerLink="/admin/users" routerLinkActive="active">Usuarios</a></li>
        </ul>
        <button class="btn-logout" (click)="logout()">Cerrar Sesión</button>
      </nav>

      <main class="admin-main">
        <router-outlet></router-outlet>
      </main>

      <footer class="admin-footer">
        &copy; 2024 Panel de Administración CMS
      </footer>
    </div>
  `
})
export class AdminLayout {
  private authService = inject(AuthService);

  logout() {
    this.authService.logout();
  }
}
