import { Component, signal, OnInit, inject } from '@angular/core';

import { environment } from '../../../environments/environment';
import { DocumentService } from '../../core/services/document.service';
import { CategoryService, Category } from '../../core/services/category.service';
import { SubjectService, Subject } from '../../core/services/subject.service';
import { TextViewerComponent } from '../text-viewer/text-viewer';

type Lang = 'es' | 'en';

interface Material {
  _id: string;
  title: string;
  file: string;
  type: string;
  description?: string;
}

interface Unidad {
  numero: string;
  tituloEs: string;
  tituloEn: string;
  materialesEs: Material[];
  materialesEn: Material[];
  pendiente?: boolean;
}

interface MateriaData {
  subject: Subject;
  unidades: Unidad[];
}

@Component({
  selector: 'app-topics',
  imports: [TextViewerComponent],
  templateUrl: './topics.html',
  styleUrl: './topics.css',
})
export class Topics implements OnInit {
  materiaSeleccionada: string | null = null;
  idiomaProgramacion: Lang = 'es';

  private documentService = inject(DocumentService);
  private categoryService = inject(CategoryService);
  private subjectService = inject(SubjectService);

  expandido = signal<Record<string, boolean>>({});

  materiasEstructura: MateriaData[] = [];
  materiasGenerales: Unidad[] = [];

  ngOnInit(): void {
    this.cargarDatosDinamicos();
  }

  async cargarDatosDinamicos() {
    try {
      const materias = await this.subjectService.getSubjects().toPromise() || [];
      const categorias = await this.categoryService.getCategories().toPromise() || [];
      const documentos = await this.documentService.getDocuments().toPromise() || [];

      // Estructurar jerarquía
      const structure: MateriaData[] = materias.map(subject => {
        // Encontrar categorías de esta materia
        const subjectCats = categorias.filter(c => 
          c.subjectId && (c.subjectId._id === subject._id || c.subjectId === subject._id)
        );

        let count = 1;
        const unidades: Unidad[] = subjectCats.map(cat => {
          // Documentos para esta categoría
          const docsCat = documentos.filter(d => 
            (d.categoryId && d.categoryId._id === cat._id) || d.categoryId === cat._id
          );

          const baseUrl = environment.apiUrl.replace(/\/api$/, '');

          const materialesEs: Material[] = docsCat.filter(d => d.es).map(d => ({
            _id: d._id,
            title: d.title,
            file: baseUrl + d.es!.path,
            type: this.getFileType(d.es!.originalName),
            description: d.description
          }));

          const materialesEn: Material[] = docsCat.filter(d => d.en).map(d => ({
            _id: d._id,
            title: d.title,
            file: baseUrl + d.en!.path,
            type: this.getFileType(d.en!.originalName),
            description: d.description
          }));

          return {
            numero: (count++).toString(),
            tituloEs: cat.name,
            tituloEn: cat.name,
            materialesEs: materialesEs,
            materialesEn: materialesEn
          };
        });

        // Buscar documentos huérfanos que apunten directamente a esta materia? No existe ese campo.
        // Solo consideraremos los documentos en secciones, y los huérfanos sin categoría los pondremos en "Materiales Generales" globalmente.
        return {
          subject,
          unidades
        };
      });

      this.materiasEstructura = structure;

      // Huérfanos
      const docsGenerales = documentos.filter(d => !d.categoryId);
      if (docsGenerales.length > 0) {
        this.materiasGenerales = [{
          numero: '*',
          tituloEs: 'Materiales Generales',
          tituloEn: 'General Materials',
          materialesEs: docsGenerales.filter(d => d.es).map(d => ({
            _id: d._id,
            title: d.title,
            file: environment.apiUrl.replace(/\/api$/, '') + d.es!.path,
            type: this.getFileType(d.es!.originalName),
            description: d.description
          })),
          materialesEn: docsGenerales.filter(d => d.en).map(d => ({
            _id: d._id,
            title: d.title,
            file: environment.apiUrl.replace(/\/api$/, '') + d.en!.path,
            type: this.getFileType(d.en!.originalName),
            description: d.description
          }))
        }];
      }

    } catch (error) {
      console.error('Error cargando datos dinámicos', error);
    }
  }

  getFileType(filename: string): string {
    if (!filename) return 'pdf';
    const ext = filename.split('.').pop()?.toLowerCase();
    if (ext === 'pdf') return 'pdf';
    if (ext === 'doc' || ext === 'docx') return 'docx';
    if (ext === 'ppt' || ext === 'pptx') return 'pptx';
    return 'pdf';
  }

  seleccionarMateria(nombre: string) {
    this.materiaSeleccionada = this.materiaSeleccionada === nombre ? null : nombre;
  }

  cambiarIdioma(l: Lang) {
    this.idiomaProgramacion = l;
  }

  toggleContenido(id: string) {
    const actual = this.expandido();
    this.expandido.set({ ...actual, [id]: !actual[id] });
  }

  estaExpandido(id: string): boolean {
    return !!this.expandido()[id];
  }
}
