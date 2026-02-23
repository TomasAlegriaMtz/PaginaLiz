import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-nav-bar',
  imports: [
    RouterModule
  ],
  templateUrl: './nav-bar.html',
  styleUrl: './nav-bar.css',
})
export class NavBar {
  // Variable de estado para controlar el menú
  isMenuOpen = false;

  // Función para alternar el estado
  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
}
