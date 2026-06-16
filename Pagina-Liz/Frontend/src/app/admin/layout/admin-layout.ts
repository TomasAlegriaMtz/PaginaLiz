import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="d-flex flex-column min-vh-100 bg-light">
      <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
        <div class="container-fluid">
          <a class="navbar-brand" href="#">Panel de Administración</a>
          <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-toggle="#navbarNav">
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse justify-content-between" id="navbarNav">
            <ul class="navbar-nav">
              <li class="nav-item">
                <a class="nav-link" routerLink="/admin/cms-categories" routerLinkActive="active">Secciones</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" routerLink="/admin/documents" routerLinkActive="active">Documentos PDF</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" routerLink="/admin/cms-home" routerLinkActive="active">Gestor de Contenido</a>
              </li>
            </ul>
            <ul class="navbar-nav">
              <li class="nav-item">
                <button class="btn btn-outline-light btn-sm mt-1" (click)="logout()">Cerrar Sesión</button>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      
      <main class="flex-grow-1 p-4">
        <div class="container">
          <router-outlet></router-outlet>
        </div>
      </main>
      
      <footer class="bg-dark text-white text-center py-3 mt-auto">
        <small>&copy; 2024 Pagina-Liz CMS</small>
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
