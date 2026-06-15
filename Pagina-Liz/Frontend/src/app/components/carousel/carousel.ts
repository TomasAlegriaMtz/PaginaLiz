import { Component } from '@angular/core';
import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common'; // Necesario para el *ngFor o @for

@Component({
  selector: 'app-carousel',
  imports: [NgbCarouselModule, CommonModule],
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
