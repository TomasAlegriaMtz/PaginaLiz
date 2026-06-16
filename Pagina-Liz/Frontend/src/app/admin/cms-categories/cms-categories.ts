import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CategoryService, Category } from '../../core/services/category.service';
import { SubjectService, Subject } from '../../core/services/subject.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cms-categories',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cms-categories.html'
})
export class CmsCategoriesComponent implements OnInit {
  categories: Category[] = [];
  subjects: Subject[] = [];
  
  newCategoryName: string = '';
  newCategorySubjectId: string = '';
  
  newSubjectName: string = '';

  isLoading = true;
  isSavingCat = false;
  isSavingSub = false;

  private categoryService = inject(CategoryService);
  private subjectService = inject(SubjectService);

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.isLoading = true;
    
    // Load subjects first
    this.subjectService.getSubjects().subscribe({
      next: (subs) => {
        this.subjects = subs;
        if (subs.length > 0 && !this.newCategorySubjectId) {
          this.newCategorySubjectId = subs[0]._id;
        }

        // Then load categories
        this.categoryService.getCategories().subscribe({
          next: (cats) => {
            this.categories = cats;
            this.isLoading = false;
          },
          error: (err) => {
            console.error('Error loading categories', err);
            this.isLoading = false;
            Swal.fire('Error', 'No se pudieron cargar las secciones.', 'error');
          }
        });

      },
      error: (err) => {
        console.error('Error loading subjects', err);
        this.isLoading = false;
        Swal.fire('Error', 'No se pudieron cargar las materias.', 'error');
      }
    });
  }

  createSubject() {
    if (!this.newSubjectName.trim()) return;
    this.isSavingSub = true;

    this.subjectService.createSubject(this.newSubjectName).subscribe({
      next: () => {
        this.newSubjectName = '';
        this.isSavingSub = false;
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          title: 'Materia creada con éxito',
          showConfirmButton: false,
          timer: 3000
        });
        this.loadData();
      },
      error: (err) => {
        console.error('Error creating subject', err);
        Swal.fire('Error', 'Error al crear la materia. Puede que el nombre ya exista.', 'error');
        this.isSavingSub = false;
      }
    });
  }

  createCategory() {
    if (!this.newCategoryName.trim() || !this.newCategorySubjectId) return;
    this.isSavingCat = true;

    this.categoryService.createCategory(this.newCategoryName, this.newCategorySubjectId).subscribe({
      next: () => {
        this.newCategoryName = '';
        this.isSavingCat = false;
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          title: 'Sección creada con éxito',
          showConfirmButton: false,
          timer: 3000
        });
        this.loadData();
      },
      error: (err) => {
        console.error('Error creating category', err);
        Swal.fire('Error', 'Error al crear la sección. Puede que el nombre ya exista.', 'error');
        this.isSavingCat = false;
      }
    });
  }

  deleteSubject(id: string) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¿Deseas eliminar esta materia? Asegúrate de que no tenga secciones asociadas.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.subjectService.deleteSubject(id).subscribe({
          next: () => {
            Swal.fire('Eliminada', 'La materia ha sido eliminada.', 'success');
            this.loadData();
          },
          error: (err) => {
            console.error('Error deleting subject', err);
            Swal.fire('Error', 'Error al eliminar la materia.', 'error');
          }
        });
      }
    });
  }

  deleteCategory(id: string) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¿Deseas eliminar esta sección? Esto no eliminará los documentos asociados.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.categoryService.deleteCategory(id).subscribe({
          next: () => {
            Swal.fire('Eliminada', 'La sección ha sido eliminada.', 'success');
            this.loadData();
          },
          error: (err) => {
            console.error('Error deleting category', err);
            Swal.fire('Error', 'Error al eliminar la sección.', 'error');
          }
        });
      }
    });
  }
}
