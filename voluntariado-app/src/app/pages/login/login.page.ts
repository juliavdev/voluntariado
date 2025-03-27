import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule, ToastController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  providers: [ApiService],
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  email: string = '';
  senha: string = '';

  constructor(
    private router: Router,
    private apiService: ApiService,
    private toastCtrl: ToastController
  ) { }

  async login() {
    if (this.email && this.senha) {
      try {
        const response = await this.apiService.login({ email: this.email, senha: this.senha });

        const { token, tipo } = response.data;
        localStorage.setItem('usuario', JSON.stringify({ tipo, token }));

        this.router.navigate(['/home']);
        
      } catch (error) {
        console.error('Erro ao fazer login:', error);
        const toast = await this.toastCtrl.create({
          message: 'Credenciais inválidas! Tente novamente.',
          duration: 2000,
          color: 'danger',
        });
        await toast.present();
      }
    } else {
      alert('Preencha os campos corretamente!');
    }
  }

  criarConta() {
    this.router.navigate(['/registro']);
  }
}
