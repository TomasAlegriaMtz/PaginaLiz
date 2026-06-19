import { Component } from '@angular/core';
import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';
 // Necesario para el *ngFor o @for

@Component({
  selector: 'app-carousel',
  imports: [NgbCarouselModule],
  templateUrl: './carousel.html',
  styleUrl: './carousel.css',
})
export class Carousel {
  images = [
    '/foto.jpg',
    '/foto.jpg',
    '/foto.jpg'
  ];
}
