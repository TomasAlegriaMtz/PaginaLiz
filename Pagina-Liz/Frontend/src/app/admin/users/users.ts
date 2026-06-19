import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService, User } from '../../core/services/user.service';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './users.html',
  styleUrl: './users.css'
})
export class UsersComponent implements OnInit {
  users: User[] = [];
  private userService = inject(UserService);

  // Modal state
  mostrarModal = false;
  nuevoUsuario = { username: '', password: '', role: 'ADMIN' };
  errorMsg = '';

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers() {
    this.userService.getUsers().subscribe({
      next: (data) => this.users = data,
      error: (err) => console.error('Error cargando usuarios', err)
    });
  }

  abrirModalNuevoUsuario() {
    this.mostrarModal = true;
    this.nuevoUsuario = { username: '', password: '', role: 'ADMIN' };
    this.errorMsg = '';
  }

  cerrarModal() {
    this.mostrarModal = false;
  }

  crearUsuario() {
    if (!this.nuevoUsuario.username || !this.nuevoUsuario.password) {
      this.errorMsg = 'Usuario y contraseña son requeridos.';
      return;
    }
    
    this.userService.createUser(this.nuevoUsuario).subscribe({
      next: () => {
        this.cerrarModal();
        this.loadUsers();
      },
      error: (err) => {
        this.errorMsg = err.error.message || 'Error al crear usuario';
      }
    });
  }

  toggleStatus(user: User) {
    if (user.role === 'MASTER') return;
    
    this.userService.toggleStatus(user._id).subscribe({
      next: (res) => {
        user.isActive = res.isActive;
      },
      error: (err) => console.error('Error cambiando estado', err)
    });
  }
}
