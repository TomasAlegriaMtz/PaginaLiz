import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ContentService } from '../../core/services/content.service';

@Component({
  selector: 'app-gallery',
  imports: [CommonModule],
  templateUrl: './gallery.html',
  styleUrl: './gallery.css',
})
export class Gallery implements OnInit {
  images: string[] = [];
  isLoading = true;

  private modalService = inject(NgbModal);
  private contentService = inject(ContentService);

  ngOnInit(): void {
    this.contentService.getContent('gallery').subscribe({
      next: (res) => {
        if (res && res.data && res.data.images) {
          this.images = res.data.images;
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading gallery', err);
        this.isLoading = false;
      }
    });
  }

  // Función para abrir la imagen en grande
  openImage(content: any) {
    this.modalService.open(content, {
      centered: true,
      size: 'xl',
      windowClass: 'dark-modal'
    });
  }
}
