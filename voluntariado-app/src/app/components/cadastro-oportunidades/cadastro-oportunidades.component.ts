import { Component, Input, OnInit, Output } from '@angular/core';
import { IonicModule, ModalController, ToastController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-cadastro-oportunidades',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  providers: [ApiService],
  templateUrl: './cadastro-oportunidades.component.html',
  styleUrls: ['./cadastro-oportunidades.component.scss'],
})
export class CadastroOportunidadesComponent implements OnInit {
  titulo = '';
  descricao = '';
  endereco = '';
  quantidadeMaximaVoluntarios = 0;
  dataAcao = '';

  @Input() 
  oportunidade: any = null;

  @Input() 
  carregarOportunidades!: Function;

  constructor(
    private apiService: ApiService,
    private toastCtrl: ToastController,
    private router: Router,
    private modalController: ModalController
  ) { }

  ngOnInit() {
    if (this.oportunidade) {
      this.titulo = this.oportunidade.titulo;
      this.descricao = this.oportunidade.descricao;
      this.endereco = this.oportunidade.endereco;
      this.quantidadeMaximaVoluntarios = this.oportunidade.quantidadeMaximaVoluntarios;
      this.dataAcao = new Date(this.oportunidade.data).toISOString().split('T')[0];
    }
  }

  async enviar() {
    let texto: string = '';
    const oportunidade = {
      titulo: this.titulo,
      descricao: this.descricao,
      endereco: this.endereco,
      quantidadeMaximaVoluntarios: this.quantidadeMaximaVoluntarios,
      dataAcao: this.dataAcao
    };

    try {
      if (this.oportunidade) {
        texto = "cadastrar";
        await this.apiService.criaOportunidade(oportunidade);
      } else {
        texto = "atualizar";
        await this.apiService.atualizaOportunidade(oportunidade);
      }

      const toast = await this.toastCtrl.create({
        message: `Sucesso ao ${texto} a oportunidade!`,
        duration: 2000,
        color: 'success',
      });
      await toast.present();

      if (this.carregarOportunidades) {
        this.carregarOportunidades();
      }
      
      this.fecharModal();
    } catch (error) {
      console.error(`Erro ao ${texto}:`, error);

      const toast = await this.toastCtrl.create({
        message: `Erro ao ${texto} a oportunidade!`,
        duration: 2000,
        color: 'danger',
      });
      await toast.present();
    }
  }

  fecharModal() {
    this.modalController.dismiss();
  }
}
