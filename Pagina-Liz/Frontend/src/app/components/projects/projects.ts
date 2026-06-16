import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Carousel } from "../carousel/carousel";
import { ContentService } from '../../core/services/content.service';

interface Publicacion { titulo: string; fuente: string; anio: number; autores: string; }
interface ProyectoInv { codigo: string; titulo: string; anio: number; shape: 'diamond' | 'circle' | 'triangle'; }
interface Tesis { titulo: string; nivel: 'Maestría' | 'Doctorado'; estado: 'Terminada' | 'En Proceso'; anio?: string; }
interface Capitulo { titulo: string; editorial: string; anio: number; autores: string; numeroCapitulo?: string; }

@Component({
  selector: 'app-projects',
  imports: [CommonModule, Carousel],
  templateUrl: './projects.html',
  styleUrl: './projects.css',
})
export class Projects implements OnInit {
  proyectosCol1: ProyectoInv[] = [];
  proyectosCol2: ProyectoInv[] = [];
  tesis: Tesis[] = [];
  publicaciones: Publicacion[] = [];
  capitulos: Capitulo[] = [];

  isLoading = true;
  private contentService = inject(ContentService);

  ngOnInit(): void {
    this.contentService.getContent('projects').subscribe({
      next: (res) => {
        if (res && res.data) {
          this.proyectosCol1 = res.data.proyectosCol1 || [];
          this.proyectosCol2 = res.data.proyectosCol2 || [];
          this.tesis = res.data.tesis || [];
          this.publicaciones = res.data.publicaciones || [];
          this.capitulos = res.data.capitulos || [];
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading projects', err);
        this.isLoading = false;
      }
    });
  }
}
