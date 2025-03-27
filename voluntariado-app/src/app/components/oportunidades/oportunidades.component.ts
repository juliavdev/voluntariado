import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule, IonIcon, ModalController, ToastController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';
import { CadastroOportunidadesComponent } from '../cadastro-oportunidades/cadastro-oportunidades.component';
import { addIcons } from 'ionicons';
import { logInOutline, checkmarkCircleOutline, closeCircleOutline, createOutline, trashOutline } from 'ionicons/icons'

@Component({
  selector: 'app-oportunidades',
  standalone: true,
  imports: [IonicModule, CommonModule],
  providers: [ApiService],
  templateUrl: './oportunidades.component.html',
  styleUrls: ['./oportunidades.component.scss'],
})
export class OportunidadesComponent  implements OnInit {
  oportunidades: any[] = [];
  tipoUsuario = '';

  constructor(
    private router: Router,
    private apiService: ApiService,
    private toastCtrl: ToastController,
    private modalController: ModalController
  ) { 
    addIcons({ 
      logInOutline, 
      checkmarkCircleOutline, 
      closeCircleOutline,
      createOutline,
      trashOutline
    });
  }

  ngOnInit() {
    this.carregarUsuario();
    this.carregarOportunidades();
  }

  carregarUsuario() {
    const usuarioLogado = JSON.parse(localStorage.getItem('usuario') || '{}');
    this.tipoUsuario = usuarioLogado.tipo || 'entidade';
    //console.log(this.tipoUsuario);
  }

  carregarOportunidades() {
    this.apiService.listaOportunidades().then((response) => {
      this.oportunidades = response.data;
      console.log(this.oportunidades);
    }).catch((error) => {
      console.error('Erro ao buscar oportunidades:', error);

      if (error.status == 403) {
        this.apiService.logout();
        this.router.navigate(['/login']);
      }
    });
  }

  async alterarOportunidade(oportunidade: any = null) {
    const modal = await this.modalController.create({
      component: CadastroOportunidadesComponent,
      componentProps: {
        carregarOportunidades: this.carregarOportunidades.bind(this),
        oportunidade: oportunidade
      }
    });

    await modal.present();
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
  
  async editar(oportunidade: any) {
    try {
      await this.apiService.deletaOportunidade({ oportunidade });

      const toast = await this.toastCtrl.create({
        message: 'Atualização realizada com sucesso!',
        duration: 2000,
        color: 'success',
      });
      await toast.present();    
    } catch (error) {
      console.error('Erro ao atualizar a oportunidade!', error);

      const toast = await this.toastCtrl.create({
        message: 'Erro ao atualizar a oportunidade!',
        duration: 2000,
        color: 'danger',
      });
      await toast.present();
    }
  }

  async excluir(idOportunidade: any) {
    try {
      await this.apiService.deletaOportunidade({ idOportunidade });

      const toast = await this.toastCtrl.create({
        message: 'Exclusão realizada com sucesso!',
        duration: 2000,
        color: 'success',
      });
      await toast.present();
      
      this.carregarOportunidades();
    } catch (error) {
      console.error('Erro ao excluir a oportunidade!', error);

      const toast = await this.toastCtrl.create({
        message: 'Erro ao excluir a oportunidade!',
        duration: 2000,
        color: 'danger',
      });
      await toast.present();
    }
  }
}
