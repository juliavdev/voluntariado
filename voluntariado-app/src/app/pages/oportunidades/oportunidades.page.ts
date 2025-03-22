import { Component, OnInit } from '@angular/core';
import { IonicModule, ToastController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-oportunidades',
  standalone: true,
  imports: [IonicModule, CommonModule],
  templateUrl: './oportunidades.page.html',
  styleUrls: ['./oportunidades.page.scss'],
})
export class OportunidadesPage implements OnInit {
  oportunidades: any[] = [];
  tipoUsuario = '';

  constructor(
    private router: Router,
    private apiService: ApiService,
    private toastCtrl: ToastController
  ) { }

  ngOnInit() {
    this.carregarUsuario();
    this.carregarOportunidades();
  }

  carregarUsuario() {
    const usuarioLogado = JSON.parse(localStorage.getItem('usuario') || '{}');
    this.tipoUsuario = usuarioLogado.tipo || 'entidade';
    console.log(this.tipoUsuario);
  }

  carregarOportunidades() {
    this.apiService.listaOportunidades().then((response) => {
      this.oportunidades = response.data;
      console.log(this.oportunidades);
    }).catch((error) => {
      console.error('Erro ao buscar oportunidades:', error);
    });
  }

  novaOportunidade() {
    this.router.navigate(['/cadastro-oportunidade']);
  }

  async inscrever(oportunidade: any) {
    if (oportunidade.inscrito) {
      const toast = await this.toastCtrl.create({
        message: 'Você já está inscrito nessa oportunidade!',
        duration: 2000,
        color: 'warning',
      });
      await toast.present();
      return;
    }

    try {
      await this.apiService.inscreveOportunidade({ oportunidadeId: oportunidade.id });
      oportunidade.inscrito = true;

      const toast = await this.toastCtrl.create({
        message: 'Inscrição realizada com sucesso!',
        duration: 2000,
        color: 'success',
      });
      await toast.present();
    } catch (error) {
      console.error('Erro ao inscrever-se:', error);
      const toast = await this.toastCtrl.create({
        message: 'Erro ao realizar a inscrição!',
        duration: 2000,
        color: 'danger',
      });
      await toast.present();
    }
  }
}
