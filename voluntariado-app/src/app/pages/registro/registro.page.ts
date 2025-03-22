import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ApiService } from 'src/app/services/api.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage {
  tipoRegistro: string = 'voluntario';
  nome: string = '';
  email: string = '';
  telefone: string = '';
  cnpj: string = '';
  cpf: string = '';
  senha: string = '';

  constructor(
    private router: Router,
    private apiService: ApiService,
    private toastCtrl: ToastController
  ) { }

  async cadastrar() {
    const usuario = {
      nome: this.nome,
      email: this.email,
      telefone: this.telefone,
      documento: this.tipoRegistro === 'entidade' ? this.cnpj : this.cpf,
      senha: this.senha,
      tipo: this.tipoRegistro
    };

    try {
      await this.apiService.criaUsuario(usuario);

      const toast = await this.toastCtrl.create({
        message: 'Cadastro realizado com sucesso!',
        duration: 2000,
        color: 'success',
      });
      await toast.present();

      const response = await this.apiService.login({ email: usuario.email, senha: usuario.senha });

      const { token, tipo } = response.data;
      localStorage.setItem('usuario', JSON.stringify({ tipo, token }));

      this.router.navigate(['/oportunidades']);
    } catch (error) {
      console.error('Erro ao realizar o cadastro:', error);

      const toast = await this.toastCtrl.create({
        message: 'Erro ao realizar o cadastro!',
        duration: 2000,
        color: 'danger',
      });
      await toast.present();
    }
  }
}
