import { Component } from '@angular/core';
import { IonicModule, ToastController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-cadastro-oportunidade',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  templateUrl: './cadastro-oportunidade.page.html',
  styleUrls: ['./cadastro-oportunidade.page.scss'],
})
export class CadastroOportunidadePage {
  titulo = '';
  descricao = '';
  endereco = '';
  quantidadeMaximaVoluntarios = 0;
  dataAcao = '';

  constructor(
    private apiService: ApiService,
    private toastCtrl: ToastController,
    private router: Router
  ) { }

  async cadastrar() {
    const novaOportunidade = {
      titulo: this.titulo,
      descricao: this.descricao,
      endereco: this.endereco,
      quantidadeMaximaVoluntarios: this.quantidadeMaximaVoluntarios,
      dataAcao: this.dataAcao,
    };

    try {
      await this.apiService.criaOportunidade(novaOportunidade);
      const toast = await this.toastCtrl.create({
        message: 'Oportunidade cadastrada com sucesso!',
        duration: 2000,
        color: 'success',
      });
      await toast.present();
      this.router.navigate(['/oportunidades']);
    } catch (error) {
      console.error('Erro ao cadastrar:', error);
      const toast = await this.toastCtrl.create({
        message: 'Erro ao cadastrar a oportunidade!',
        duration: 2000,
        color: 'danger',
      });
      await toast.present();
    }
  }
}
