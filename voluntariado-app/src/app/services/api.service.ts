import { Injectable } from '@angular/core';
import axios from 'axios';

@Injectable({
    providedIn: 'root'
})
export class ApiService {
    private API_URL = 'http://localhost:3000';

    async criaUsuario(usuario: any) {
        return axios.post(`${this.API_URL}/criausuario`, usuario);
    }

    async listaOportunidades() {
        return axios.get(`${this.API_URL}/oportunidades`);
    }

    async criaOportunidades(oportunidade: any) {
      return axios.post(`${this.API_URL}/criaOportunidades`, oportunidade);
    }
}
