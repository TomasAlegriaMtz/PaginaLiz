import { Component, OnInit, inject } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { ContentService } from '../../core/services/content.service';
import { AssetService } from '../../core/services/asset.service';
import { DragDropDirective } from '../../core/directives/drag-drop.directive';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cms-home',
  standalone: true,
  imports: [FormsModule, DragDropDirective],
  templateUrl: './cms-home.html',
  styles: [``]
})
export class CmsHomeComponent implements OnInit {
  activeTab: 'home' | 'projects' | 'gallery' | 'footer' = 'home';

  homeData: any = { sobreMi: '', experienciaAnios: '', experienciaLista: [], carrerasTexto: '', carrerasLista: [] };
  projectsData: any = { proyectosCol1: [], proyectosCol2: [], tesis: [], publicaciones: [], capitulos: [] };
  galleryData: any = { images: [] };
  footerData: any = { facebook: '', instagram: '', tiktok: '', copyright: '' };

  isLoading = true;
  isSaving = false;

  private contentService = inject(ContentService);
  private assetService = inject(AssetService);

  ngOnInit(): void {
    this.loadAllContent();
  }

  loadAllContent() {
    this.isLoading = true;
    
    const reqs = [
      this.contentService.getContent('home').toPromise(),
      this.contentService.getContent('projects').toPromise(),
      this.contentService.getContent('gallery').toPromise(),
      this.contentService.getContent('footer').toPromise()
    ];

    Promise.all(reqs).then((results) => {
      if (results[0]?.data) this.homeData = results[0].data;
      if (results[1]?.data) this.projectsData = results[1].data;
      if (results[2]?.data) this.galleryData = results[2].data;
      if (results[3]?.data) this.footerData = results[3].data;
      
      this.isLoading = false;
    }).catch(err => {
      console.error('Error loading content', err);
      this.isLoading = false;
    });
  }

  setTab(tab: 'home' | 'projects' | 'gallery' | 'footer') {
    this.activeTab = tab;
  }

  saveContent(slug: string, data: any) {
    this.isSaving = true;
    this.contentService.updateContent(slug, data).subscribe({
      next: () => {
        this.isSaving = false;
        Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: 'Guardado', showConfirmButton: false, timer: 3000 });
      },
      error: (err) => {
        console.error('Error saving', err);
        this.isSaving = false;
        Swal.fire('Error', 'Hubo un error al guardar.', 'error');
      }
    });
  }

  // --- Home Helpers ---
  addStringItem(arr: string[]) { arr.push(''); }
  removeStringItem(arr: string[], index: number) { arr.splice(index, 1); }
  trackByIndex(index: number, obj: any): any { return index; }

  // --- Projects Helpers ---
  addProject(col: any[]) { col.push({ codigo: '', titulo: '', anio: 2024, shape: 'diamond' }); }
  removeProject(col: any[], idx: number) { col.splice(idx, 1); }

  addTesis() { this.projectsData.tesis.push({ titulo: '', nivel: 'Maestría', estado: 'En Proceso', anio: '' }); }
  removeTesis(idx: number) { this.projectsData.tesis.splice(idx, 1); }

  addPub() { this.projectsData.publicaciones.push({ titulo: '', fuente: '', anio: 2024, autores: '' }); }
  removePub(idx: number) { this.projectsData.publicaciones.splice(idx, 1); }

  addCapitulo() { this.projectsData.capitulos.push({ titulo: '', editorial: '', anio: 2024, autores: '', numeroCapitulo: '' }); }
  removeCapitulo(idx: number) { this.projectsData.capitulos.splice(idx, 1); }

  // --- Gallery Helpers ---
  removeImage(idx: number) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'La imagen será eliminada de la galería pública y del servidor permanentemente.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        const url = this.galleryData.images[idx];
        const filename = url.split('/').pop();
        
        if (filename && filename !== 'foto.jpg') {
          this.assetService.deleteAsset(filename).subscribe({
            next: () => {
              this.galleryData.images.splice(idx, 1);
              this.saveContent('gallery', this.galleryData);
            },
            error: (err) => {
              console.error('Error deleting asset physically', err);
              // Fallback to removing from UI anyway
              this.galleryData.images.splice(idx, 1);
              this.saveContent('gallery', this.galleryData);
            }
          });
        } else {
          // If it's the static foto.jpg or something without filename
          this.galleryData.images.splice(idx, 1);
          this.saveContent('gallery', this.galleryData);
        }
      }
    });
  }

  onFilesSelected(event: any) {
    const files: FileList = event.target.files;
    if (files && files.length > 0) {
      this.uploadImages(files);
    }
  }

  onFilesDropped(files: FileList) {
    if (files && files.length > 0) {
      this.uploadImages(files);
    }
  }

  private async uploadImages(files: FileList) {
    const total = files.length;
    let uploadedCount = 0;

    Swal.fire({
      title: `Subiendo 0 de ${total} imágenes...`,
      allowOutsideClick: false,
      didOpen: () => { Swal.showLoading(); }
    });

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file.type.startsWith('image/')) continue;

      try {
        const res = await this.assetService.uploadAsset(file).toPromise();
        if (res?.url) {
          this.galleryData.images.push(`http://localhost:3000${res.url}`);
        }
      } catch (err) {
        console.error('Error subiendo imagen', file.name, err);
      }
      
      uploadedCount++;
      Swal.update({ title: `Subiendo ${uploadedCount} de ${total} imágenes...` });
    }

    Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: 'Imágenes subidas', showConfirmButton: false, timer: 3000 });
    
    // Auto-save gallery
    this.saveContent('gallery', this.galleryData);
  }
}
