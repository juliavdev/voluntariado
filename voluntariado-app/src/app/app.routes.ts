import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
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
    loadComponent: () => import('./pages/home/home.page').then(m => m.HomePage)
  },
  {
    path: 'oportunidades',
    loadComponent: () => import('./pages/oportunidades/oportunidades.page').then(m => m.OportunidadesPage)
  },
  {
    path: 'cadastro-oportunidade',
    loadComponent: () => import('./pages/cadastro-oportunidade/cadastro-oportunidade.page').then(m => m.CadastroOportunidadePage)
  },
];
