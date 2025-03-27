import { Injectable } from '@angular/core';
import axios from 'axios';

@Injectable({
    providedIn: 'root'
})
export class ApiService {
    private API_URL = 'http://localhost:3000';

    constructor() {
        axios.interceptors.request.use(
            (config) => {
                const token = this.getToken();

                if (token) {
                    config.headers['Authorization'] = `Bearer ${token}`;
                }

                return config;
            },
            (error) => {
                return Promise.reject(error);
            }
        );
    }

    async criaUsuario(usuario: any) {
        return axios.post(`${this.API_URL}/criausuario`, usuario);
    }

    async listaOportunidades() {
        return axios.get(`${this.API_URL}/oportunidadesDisponiveis`);
    }

    async criaOportunidade(oportunidade: any) {
        return axios.post(`${this.API_URL}/criaOportunidade`, oportunidade);
    }

    async atualizaOportunidade(oportunidade: any) {
        return axios.post(`${this.API_URL}/atualizaOportunidade`, oportunidade);
    }

    async deletaOportunidade(oportunidade: any) {
        return axios.post(`${this.API_URL}/deletaOportunidade`, oportunidade);
    }

    async inscreveOportunidade(oportunidade: any) {
        return axios.post(`${this.API_URL}/inscreveOportunidade`, oportunidade);
    }

    async minhasOportunidades(oportunidade: any) {
        return axios.post(`${this.API_URL}/minhasOportunidades`, oportunidade);
    }

    async login(credentials: { email: string, senha: string }) {
        return axios.post(`${this.API_URL}/login`, credentials);
    }

    logout() {
        localStorage.removeItem('usuario');
    }

    getToken() {
        const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
        return usuario.token || '';
    }
}
