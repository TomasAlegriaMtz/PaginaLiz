import { Component, signal, inject } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { NavBar } from './components/nav-bar/nav-bar';
import { Footer } from './components/footer/footer';
import { filter } from 'rxjs/operators';


@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    NavBar,
    Footer
],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('Pagina-Liz');
  isAdminRoute = false;

  constructor(private router: Router) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.isAdminRoute = event.urlAfterRedirects.startsWith('/admin');
    });
  }
}
