import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule, ToastController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { ApiService } from './services/api.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [IonicModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  constructor(
    private router: Router,
    private apiService: ApiService,
    private toastCtrl: ToastController
  ) { }

  async navigateToProtectedPage(page: string) {
    const usuario = localStorage.getItem('usuario');

    if (!usuario) {
      const toast = await this.toastCtrl.create({
        message: 'Essa página só pode ser acessada se você estiver logado.',
        duration: 2000,
        color: 'danger',
      });
      await toast.present();

      this.router.navigate(['/login']);
    } else {
      this.router.navigate([`/${page}`]);
    }
  }

  navigateToPage(page: string) {
    this.router.navigate([`/${page}`]);
  }

  logoff() {
    this.apiService.logout();
    this.router.navigate(['/login']);
  }
}
