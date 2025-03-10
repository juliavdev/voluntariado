import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

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

  cadastrar() {
    console.log('Tipo:', this.tipoRegistro);
    console.log('Nome:', this.nome);
    console.log('Email:', this.email);
    console.log('Telefone:', this.telefone);

    if (this.tipoRegistro === 'entidade') {
      console.log('CNPJ:', this.cnpj);
    }

    alert('Cadastro realizado com sucesso!');
  }
}
