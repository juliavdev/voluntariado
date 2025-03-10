import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  texto: string = '';
  mensagem: string = '';

  exibirTexto() {
    this.mensagem = this.texto;
  }
}
