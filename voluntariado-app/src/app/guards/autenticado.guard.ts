import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import type { CanMatch, GuardResult, MaybeAsync, Route, UrlSegment } from '@angular/router';
import { ApiService } from '../services/api.service';

@Injectable({
  providedIn: 'root'
})
export class AutenticadoGuard implements CanMatch {

  constructor(
    private router: Router,
		private apiService: ApiService
	) { }

  canMatch(
    route: Route, 
    segments: UrlSegment[]): MaybeAsync<GuardResult> {

    const token = localStorage.getItem('usuario');

    if (!token) {
      this.apiService.logout();
      this.router.navigate(['/login']);
      return false;
    }

    return new Promise(async (res) => {
        res(true);
    });
  }
}
