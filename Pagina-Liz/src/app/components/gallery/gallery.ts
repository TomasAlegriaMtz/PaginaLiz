import { Component, inject } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-gallery',
  imports: [],
  templateUrl: './gallery.html',
  styleUrl: './gallery.css',
})
export class Gallery {
  private modalService = inject(NgbModal);

  // Función para abrir la imagen en grande
  openImage(content: any) {
    this.modalService.open(content, {
      centered: true,
      size: 'xl',
      windowClass: 'dark-modal' // Clase opcional para estilos oscuros
    });
  }
}
