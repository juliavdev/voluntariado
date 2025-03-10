import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IonicModule, ToastController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cadastro-oportunidade',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  templateUrl: './cadastro-oportunidade.page.html',
  styleUrls: ['./cadastro-oportunidade.page.scss'],
})
export class CadastroOportunidadePage {
  titulo = '';
  data = '';
  apiUrl = 'http://localhost:3000/oportunidades'; // TODO: adicionar o endpoint real

  // constructor(private http: HttpClient, private toastCtrl: ToastController, private router: Router) { }

  cadastrar() {
    const novaOportunidade = { titulo: this.titulo, data: this.data };

    // this.http.post(this.apiUrl, novaOportunidade).subscribe({
    //   next: async () => {
    //     const toast = await this.toastCtrl.create({
    //       message: 'Oportunidade cadastrada com sucesso!',
    //       duration: 2000,
    //       color: 'success',
    //     });
    //     await toast.present();
    //     this.router.navigate(['/oportunidades']);
    //   },
    //   error: async (error) => {
    //     console.error('Erro ao cadastrar:', error);
    //     const toast = await this.toastCtrl.create({
    //       message: 'Erro ao cadastrar a oportunidade!',
    //       duration: 2000,
    //       color: 'danger',
    //     });
    //     await toast.present();
    //   },
    // });

    console.log(novaOportunidade)
  }
}
