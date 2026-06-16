import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { Gallery } from './components/gallery/gallery';
import { Projects } from './components/projects/projects';
import { Topics } from './components/topics/topics';
import { AdminLayout } from './admin/layout/admin-layout';
import { LoginComponent } from './admin/login/login';
import { DocumentsComponent } from './admin/documents/documents';
import { CmsHomeComponent } from './admin/cms-home/cms-home';
import { CmsCategoriesComponent } from './admin/cms-categories/cms-categories';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
    { path: '', component: Home },
    { path: 'gallery', component: Gallery },
    { path: 'projects', component: Projects },
    { path: 'topics', component: Topics },
    { path: 'admin/login', component: LoginComponent },
    { 
      path: 'admin', 
      component: AdminLayout,
      canActivate: [authGuard],
      children: [
        { path: '', redirectTo: 'documents', pathMatch: 'full' },
        { path: 'documents', component: DocumentsComponent },
        { path: 'cms-categories', component: CmsCategoriesComponent },
        { path: 'cms-home', component: CmsHomeComponent }
      ]
    }
];
