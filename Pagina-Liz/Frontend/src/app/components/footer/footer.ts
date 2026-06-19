import { Component, OnInit, inject } from '@angular/core';

import { ContentService } from '../../core/services/content.service';

@Component({
  selector: 'app-footer',
  imports: [],
  templateUrl: './footer.html',
  styleUrl: './footer.css',
})
export class Footer implements OnInit {
  year: number = new Date().getFullYear();
  footerData: any = {
    facebook: '#',
    instagram: '#',
    tiktok: '#',
    copyright: 'Universidad Autónoma de Aguascalientes'
  };

  private contentService = inject(ContentService);

  ngOnInit(): void {
    this.contentService.getContent('footer').subscribe({
      next: (res) => {
        if (res && res.data) {
          this.footerData = res.data;
        }
      },
      error: (err) => console.error('Error loading footer', err)
    });
  }
}
