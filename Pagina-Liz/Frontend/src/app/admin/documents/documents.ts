import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DocumentService, Document } from '../../core/services/document.service';
import { CategoryService, Category } from '../../core/services/category.service';
import { SubjectService, Subject } from '../../core/services/subject.service';
import { DragDropDirective } from '../../core/directives/drag-drop.directive';
import Swal from 'sweetalert2';

export interface PendingDocument {
  file: File;
  title: string;
  description: string;
  subjectId: string;
  categoryId: string;
}

@Component({
  selector: 'app-admin-documents',
  standalone: true,
  imports: [CommonModule, FormsModule, DragDropDirective],
  templateUrl: './documents.html',
  styles: [``]
})
export class DocumentsComponent implements OnInit {
  activeTab: 'documents' | 'categories' = 'documents';

  documents: any[] = [];
  categories: Category[] = [];
  subjects: Subject[] = [];
  
  // Categories/Subjects state
  newCategoryName: string = '';
  newCategorySubjectId: string = '';
  newSubjectName: string = '';
  isSavingCat = false;
  isSavingSub = false;
  
  // Pending documents staging area
  pendingUploads: PendingDocument[] = [];
  
  // Existing documents editing state
  editingDocId: string | null = null;
  editData: { title: string; description: string; subjectId: string; categoryId: string } = {
    title: '', description: '', subjectId: '', categoryId: ''
  };
  
  isUploading = false;
  uploadError = '';
  
  private documentService = inject(DocumentService);
  private categoryService = inject(CategoryService);
  private subjectService = inject(SubjectService);

  ngOnInit(): void {
    this.loadData();
    this.loadDocuments();
  }

  loadData() {
    this.subjectService.getSubjects().subscribe({
      next: (subs) => {
        this.subjects = subs;
        this.categoryService.getCategories().subscribe({
          next: (cats) => {
            this.categories = cats;
          },
          error: (err) => {
            console.error('Error loading categories', err);
            Swal.fire('Error', 'No se pudieron cargar las secciones', 'error');
          }
        });
      },
      error: (err) => {
        console.error('Error loading subjects', err);
        Swal.fire('Error', 'No se pudieron cargar las materias', 'error');
      }
    });
  }

  getFilteredCategories(subjectId: string): Category[] {
    if (!subjectId) return [];
    return this.categories.filter(c => 
      c.subjectId && (c.subjectId._id === subjectId || c.subjectId === subjectId)
    );
  }

  onPendingSubjectChange(pending: PendingDocument) {
    const filtered = this.getFilteredCategories(pending.subjectId);
    pending.categoryId = filtered.length > 0 ? filtered[0]._id : '';
  }

  onEditSubjectChange() {
    const filtered = this.getFilteredCategories(this.editData.subjectId);
    this.editData.categoryId = filtered.length > 0 ? filtered[0]._id : '';
  }

  setTab(tab: 'documents' | 'categories') {
    this.activeTab = tab;
  }

  createSubject() {
    if (!this.newSubjectName.trim()) return;
    this.isSavingSub = true;

    this.subjectService.createSubject(this.newSubjectName).subscribe({
      next: () => {
        this.newSubjectName = '';
        this.isSavingSub = false;
        Swal.fire({
          toast: true, position: 'top-end', icon: 'success', title: 'Materia creada',
          showConfirmButton: false, timer: 3000
        });
        this.loadData();
      },
      error: (err) => {
        console.error('Error creating subject', err);
        Swal.fire('Error', 'Error al crear la materia. Puede que ya exista.', 'error');
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
          toast: true, position: 'top-end', icon: 'success', title: 'Sección creada',
          showConfirmButton: false, timer: 3000
        });
        this.loadData();
      },
      error: (err) => {
        console.error('Error creating category', err);
        Swal.fire('Error', 'Error al crear la sección. Puede que ya exista.', 'error');
        this.isSavingCat = false;
      }
    });
  }

  deleteSubject(id: string) {
    Swal.fire({
      title: '¿Estás seguro?', text: '¿Deseas eliminar esta materia?',
      icon: 'warning', showCancelButton: true, confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6', confirmButtonText: 'Sí, eliminar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.subjectService.deleteSubject(id).subscribe({
          next: () => { Swal.fire('Eliminada', 'La materia ha sido eliminada.', 'success'); this.loadData(); },
          error: (err) => { console.error('Error deleting', err); Swal.fire('Error', 'No se pudo eliminar.', 'error'); }
        });
      }
    });
  }

  deleteCategory(id: string) {
    Swal.fire({
      title: '¿Estás seguro?', text: '¿Deseas eliminar esta sección?',
      icon: 'warning', showCancelButton: true, confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6', confirmButtonText: 'Sí, eliminar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.categoryService.deleteCategory(id).subscribe({
          next: () => { Swal.fire('Eliminada', 'La sección ha sido eliminada.', 'success'); this.loadData(); },
          error: (err) => { console.error('Error deleting', err); Swal.fire('Error', 'No se pudo eliminar.', 'error'); }
        });
      }
    });
  }

  loadDocuments() {
    this.documentService.getDocuments().subscribe({
      next: (docs) => {
        // Map docs to ensure we have subjectId at top level for easy editing
        this.documents = docs.map((d: any) => {
          let subjectId = '';
          if (d.categoryId && d.categoryId.subjectId) {
            subjectId = d.categoryId.subjectId._id || d.categoryId.subjectId;
          }
          return { ...d, subjectId };
        });
      },
      error: (err) => {
        console.error('Error loading documents', err);
        Swal.fire('Error', 'No se pudieron cargar los documentos', 'error');
      }
    });
  }

  getCategoryName(id: any): string {
    if (!id) return 'General';
    let catName = id.name ? id.name : (this.categories.find(c => c._id === id)?.name || 'General');
    let subId = id.subjectId ? id.subjectId : (this.categories.find(c => c._id === id)?.subjectId);
    
    if (subId) {
      let subName = subId.name ? subId.name : (this.subjects.find(s => s._id === subId)?.name);
      if (subName) return `${subName} / ${catName}`;
    }
    return catName;
  }

  onFilesSelected(event: any) {
    const files: FileList = event.target.files;
    if (files && files.length > 0) {
      this.stageDocuments(files);
    }
  }

  onFilesDropped(files: FileList) {
    if (files && files.length > 0) {
      this.stageDocuments(files);
    }
  }

  private stageDocuments(files: FileList) {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const title = file.name.replace(/\.[^/.]+$/, "");
      
      const defaultSubject = this.subjects.length > 0 ? this.subjects[0]._id : '';
      const filtered = this.getFilteredCategories(defaultSubject);
      const defaultCategory = filtered.length > 0 ? filtered[0]._id : '';

      this.pendingUploads.push({
        file,
        title,
        description: '',
        subjectId: defaultSubject,
        categoryId: defaultCategory
      });
    }
    
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    if(fileInput) fileInput.value = '';
  }

  removePending(idx: number) {
    this.pendingUploads.splice(idx, 1);
  }

  async uploadPending(idx: number) {
    const p = this.pendingUploads[idx];
    if (!p.categoryId) {
      Swal.fire('Atención', 'Selecciona una materia y sección', 'warning');
      return;
    }
    
    try {
      Swal.fire({ title: 'Subiendo...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
      const doc = await this.documentService.uploadDocument(p.title, p.description, p.categoryId, p.file).toPromise();
      if (doc) {
        this.removePending(idx);
        this.loadDocuments(); // reload to get populated data
        Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: 'Subido', showConfirmButton: false, timer: 3000 });
      }
    } catch (err) {
      console.error('Error subiendo documento', err);
      Swal.fire('Error', 'No se pudo subir el documento', 'error');
    }
  }

  async uploadAllPending() {
    const invalid = this.pendingUploads.find(p => !p.categoryId);
    if (invalid) {
      Swal.fire('Atención', 'Todos los documentos deben tener materia y sección', 'warning');
      return;
    }

    const total = this.pendingUploads.length;
    let uploadedCount = 0;

    Swal.fire({ title: `Subiendo 0 de ${total}...`, allowOutsideClick: false, didOpen: () => Swal.showLoading() });

    // Clonamos para evitar problemas con los índices al eliminar
    const uploads = [...this.pendingUploads];
    
    for (const p of uploads) {
      try {
        await this.documentService.uploadDocument(p.title, p.description, p.categoryId, p.file).toPromise();
        uploadedCount++;
        Swal.update({ title: `Subiendo ${uploadedCount} de ${total}...` });
      } catch (err) {
        console.error('Error en', p.title, err);
      }
    }

    this.pendingUploads = [];
    this.loadDocuments();
    Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: 'Todos subidos', showConfirmButton: false, timer: 3000 });
  }

  startEdit(doc: any) {
    this.editingDocId = doc._id;
    this.editData = {
      title: doc.title,
      description: doc.description || '',
      subjectId: doc.subjectId,
      categoryId: doc.categoryId?._id || doc.categoryId
    };
  }

  cancelEdit() {
    this.editingDocId = null;
  }

  saveEdit() {
    if (!this.editData.categoryId) {
      Swal.fire('Atención', 'Debes seleccionar una materia y sección', 'warning');
      return;
    }

    if (!this.editingDocId) return;

    this.documentService.updateDocument(this.editingDocId, this.editData).subscribe({
      next: (updated) => {
        this.editingDocId = null;
        this.loadDocuments();
        Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: 'Guardado', showConfirmButton: false, timer: 3000 });
      },
      error: (err) => {
        console.error('Error updating document', err);
        Swal.fire('Error', 'Hubo un error al actualizar el documento', 'error');
      }
    });
  }

  onDelete(id: string) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¿Deseas eliminar este documento? Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.documentService.deleteDocument(id).subscribe({
          next: () => {
            this.documents = this.documents.filter(d => d._id !== id);
            Swal.fire('Eliminado', 'El documento ha sido eliminado.', 'success');
          },
          error: (err) => {
            console.error('Error deleting document', err);
            Swal.fire('Error', 'Hubo un error al eliminar el documento', 'error');
          }
        });
      }
    });
  }
}
