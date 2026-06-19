import { Component, Input, OnInit, OnChanges, SimpleChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocumentService, DocumentTextResponse } from '../../core/services/document.service';

@Component({
  selector: 'app-text-viewer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './text-viewer.html',
  styleUrl: './text-viewer.css'
})
export class TextViewerComponent implements OnInit, OnChanges {
  @Input() documentId: string = '';
  @Input() initialLang: 'es' | 'en' = 'es';

  currentLang: 'es' | 'en' = 'es';
  content: string = '';
  isLoading = false;
  hasError = false;

  private documentService = inject(DocumentService);

  ngOnInit() {
    this.currentLang = this.initialLang;
    if (this.documentId) this.loadContent();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['documentId'] && !changes['documentId'].isFirstChange()) {
      this.loadContent();
    }
  }

  switchLang(lang: 'es' | 'en') {
    if (lang === this.currentLang) return;
    this.currentLang = lang;
    this.loadContent();
  }

  private loadContent() {
    if (!this.documentId) return;
    this.isLoading = true;
    this.hasError = false;
    this.content = '';

    this.documentService.getDocumentText(this.documentId, this.currentLang).subscribe({
      next: (res: DocumentTextResponse) => {
        this.content = res.content;
        this.isLoading = false;
      },
      error: () => {
        this.hasError = true;
        this.isLoading = false;
      }
    });
  }
}
