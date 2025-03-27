import { Routes } from '@angular/router';
import { AutenticadoGuard } from './guards/autenticado.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.page').then(m => m.LoginPage)
  },
  {
    path: 'registro',
    loadComponent: () => import('./pages/registro/registro.page').then(m => m.RegistroPage)
  },
  {
    path: 'home',
    canMatch: [AutenticadoGuard],
    loadComponent: () => import('./pages/home/home.page').then(m => m.HomePage)
  }
];
