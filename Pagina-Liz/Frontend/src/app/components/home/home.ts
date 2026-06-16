import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Carousel } from "../carousel/carousel";
import { ContentService } from '../../core/services/content.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [Carousel, CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  homeData: any = null;
  isLoading = true;

  private contentService = inject(ContentService);

  ngOnInit(): void {
    this.contentService.getContent('home').subscribe({
      next: (res) => {
        if (res && res.data) {
          this.homeData = res.data;
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading home content', err);
        this.isLoading = false;
      }
    });
  }
}
