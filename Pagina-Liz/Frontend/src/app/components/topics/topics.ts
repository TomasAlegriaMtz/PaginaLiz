import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TemaDetalle } from '../tema-detalle/tema-detalle';

type Lang = 'es' | 'en';

type BlockType = 'heading' | 'paragraph' | 'code';

interface ContentBlock {
  type: BlockType;
  level?: number;
  text: string;
}

interface DocContent {
  title: string;
  blocks: ContentBlock[];
}

interface Material {
  title: string;
  file: string;
  type: 'pdf' | 'docx' | 'pptx';
  contentKey?: string; // JSON key for the inline text content
}

interface Unidad {
  numero: string;
  tituloEs: string;
  tituloEn: string;
  materialesEs: Material[];
  materialesEn: Material[];
  pendiente?: boolean;
}

@Component({
  selector: 'app-topics',
  imports: [CommonModule, TemaDetalle],
  templateUrl: './topics.html',
  styleUrl: './topics.css',
})
export class Topics {
  materiaSeleccionada: string | null = null;
  idiomaProgramacion: Lang = 'es';

  // Cache de contenido cargado por key
  contenidoCargado = signal<Record<string, DocContent>>({});
  // Estado de expansión por key
  expandido = signal<Record<string, boolean>>({});
  // Estado de carga
  cargando = signal<Record<string, boolean>>({});

  // Materia 1: Lógica de Programación (lista simple)
  temasLogica = [
    'Algoritmos y diagramas de flujo',
    'Estructuras condicionales',
    'Estructuras cíclicas',
    'Arreglos'
  ];

  // Materia 2: Programación I - Lenguaje C
  unidadesProgramacion: Unidad[] = [
    {
      numero: '1',
      tituloEs: 'Funciones',
      tituloEn: 'Functions',
      materialesEs: [
        { title: 'Funciones en C', file: 'materials/programacion-1/unidad-1/Funciones.pdf', type: 'pdf', contentKey: 'u1-funciones.es' }
      ],
      materialesEn: [
        { title: 'Functions in C', file: 'materials/programacion-1/unidad-1/Functions.docx', type: 'docx', contentKey: 'u1-functions.en' }
      ]
    },
    {
      numero: '2',
      tituloEs: 'Tipos de Datos Estructurados',
      tituloEn: 'Structural Data Types',
      materialesEs: [
        { title: 'Tipos de Datos Estructurados (Unidad 2)', file: 'materials/programacion-1/unidad-2/Unidad2-TiposDatosEstr.pdf', type: 'pdf', contentKey: 'u2-tipos-datos-estr.es' },
        { title: 'Enumeraciones', file: 'materials/programacion-1/unidad-2/Enumeraciones.pdf', type: 'pdf', contentKey: 'u2-enumeraciones.es' },
        { title: 'Uniones - Parte I', file: 'materials/programacion-1/unidad-2/Uniones_ParteI.pdf', type: 'pdf', contentKey: 'u2-uniones-i.es' },
        { title: 'Uniones - Parte II', file: 'materials/programacion-1/unidad-2/Uniones_ParteII.pdf', type: 'pdf', contentKey: 'u2-uniones-ii.es' },
        { title: 'Uniones - Parte III', file: 'materials/programacion-1/unidad-2/Uniones_ParteIII.pdf', type: 'pdf', contentKey: 'u2-uniones-iii.es' }
      ],
      materialesEn: [
        { title: 'Structural Data Types', file: 'materials/programacion-1/unidad-2/StructuralDataTypes.docx', type: 'docx', contentKey: 'u2-structural-data.en' },
        { title: 'Enumerations', file: 'materials/programacion-1/unidad-2/Enumerations.docx', type: 'docx', contentKey: 'u2-enumerations.en' },
        { title: 'Unions - Part I', file: 'materials/programacion-1/unidad-2/Unions_PartI.docx', type: 'docx', contentKey: 'u2-unions-i.en' },
        { title: 'Unions - Part II', file: 'materials/programacion-1/unidad-2/Unions_PartII.docx', type: 'docx', contentKey: 'u2-unions-ii.en' },
        { title: 'Unions - Part III', file: 'materials/programacion-1/unidad-2/Unions_PartIII.docx', type: 'docx', contentKey: 'u2-unions-iii.en' }
      ]
    },
    {
      numero: '3',
      tituloEs: 'Apuntadores y Memoria Dinámica',
      tituloEn: 'Pointers and Dynamic Memory',
      materialesEs: [
        { title: 'Apuntadores en C', file: 'materials/programacion-1/unidad-3/pointersC.pdf', type: 'pdf', contentKey: 'u3-apuntadores.es' },
        { title: 'Aritmética de Apuntadores', file: 'materials/programacion-1/unidad-3/AritmeticaPunteros.pptx', type: 'pptx', contentKey: 'u3-aritmetica-punteros.es' },
        { title: 'Memoria Dinámica', file: 'materials/programacion-1/unidad-3/U3.MemoriaDinamica.docx', type: 'docx', contentKey: 'u3-memoria-dinamica.es' }
      ],
      materialesEn: [
        { title: 'Pointers and Arrays in C', file: 'materials/programacion-1/unidad-3/Pointers_and_Arrays_in_C.docx', type: 'docx', contentKey: 'u3-pointers-arrays.en' },
        { title: 'Pointer Arithmetic', file: 'materials/programacion-1/unidad-3/Pointer_Arithmetic.pptx', type: 'pptx', contentKey: 'u3-pointer-arithmetic.en' },
        { title: 'Dynamic Memory', file: 'materials/programacion-1/unidad-3/U3_DynamicMemory.docx', type: 'docx', contentKey: 'u3-dynamic-memory.en' }
      ]
    },
    {
      numero: '4',
      tituloEs: 'Próximamente',
      tituloEn: 'Coming soon',
      materialesEs: [],
      materialesEn: [],
      pendiente: true
    }
  ];

  seleccionarMateria(nombre: string) {
    this.materiaSeleccionada = this.materiaSeleccionada === nombre ? null : nombre;
  }

  cambiarIdioma(l: Lang) {
    this.idiomaProgramacion = l;
  }

  async toggleContenido(key: string | undefined) {
    if (!key) return;
    const actual = this.expandido();
    const nuevoEstado = !actual[key];
    this.expandido.set({ ...actual, [key]: nuevoEstado });

    if (nuevoEstado && !this.contenidoCargado()[key]) {
      this.cargando.set({ ...this.cargando(), [key]: true });
      try {
        const res = await fetch(`materials/programacion-1/content/${key}.json`);
        if (res.ok) {
          const data: DocContent = await res.json();
          this.contenidoCargado.set({ ...this.contenidoCargado(), [key]: data });
        }
      } catch (e) {
        console.error('Error cargando contenido:', e);
      } finally {
        this.cargando.set({ ...this.cargando(), [key]: false });
      }
    }
  }

  estaExpandido(key: string | undefined): boolean {
    return !!(key && this.expandido()[key]);
  }

  obtenerContenido(key: string | undefined): DocContent | undefined {
    return key ? this.contenidoCargado()[key] : undefined;
  }

  estaCargando(key: string | undefined): boolean {
    return !!(key && this.cargando()[key]);
  }
}
