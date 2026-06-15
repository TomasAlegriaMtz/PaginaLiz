import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { Gallery } from './components/gallery/gallery';
import { Projects } from './components/projects/projects';
import { Topics } from './components/topics/topics';

export const routes: Routes = [
    { path: '', component: Home },
    { path: 'gallery', component: Gallery },
    { path: 'projects', component: Projects },
    { path: 'topics', component: Topics },
];
