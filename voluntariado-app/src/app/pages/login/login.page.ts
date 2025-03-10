import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  email: string = '';
  senha: string = '';

  constructor(private router: Router) { }
  login() {
    if (this.email && this.senha) {
      const tipoUsuario = this.email.includes('entidade') ? 'entidade' : 'voluntario';

      localStorage.setItem('usuario', JSON.stringify({ tipo: tipoUsuario }));

      this.router.navigate(['/oportunidades']);
    } else {
      alert('Preencha os campos corretamente!');
    }
  }
}
