import { Component, OnInit } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-oportunidades',
  standalone: true,
  imports: [IonicModule, CommonModule, HttpClientModule],
  templateUrl: './oportunidades.page.html',
  styleUrls: ['./oportunidades.page.scss'],
})
export class OportunidadesPage implements OnInit {
  oportunidades: any[] = [];
  apiUrl = 'http://localhost:3000/oportunidades'; // TODO: adicionar o endpoint real
  tipoUsuario = '';

  constructor(private http: HttpClient, private router: Router) { }

  ngOnInit() {
    this.carregarUsuario();
    this.carregarOportunidades();
  }

  carregarUsuario() {
    const usuarioLogado = JSON.parse(localStorage.getItem('usuario') || '{}');
    this.tipoUsuario = usuarioLogado.tipo || 'entidade';
    console.log(this.tipoUsuario)
  }

  carregarOportunidades() {
    // this.http.get<any[]>(this.apiUrl).subscribe({
    //   next: (data) => (this.oportunidades = data),
    //   error: (error) => console.error('Erro ao buscar oportunidades:', error),
    // });
    this.oportunidades = []
  }

  novaOportunidade() {
    this.router.navigate(['/cadastro-oportunidade']);
  }
}
