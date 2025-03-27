import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OportunidadesComponent } from "../../components/oportunidades/oportunidades.component";
import { ApiService } from 'src/app/services/api.service';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { logOutOutline } from 'ionicons/icons';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, OportunidadesComponent],
  providers: [ApiService],
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor(
    private apiService: ApiService,
    private router: Router
  ) { 
    addIcons({ logOutOutline });
  }

  sair() {
    this.apiService.logout();
    this.router.navigate(['/login']);
  }
}
