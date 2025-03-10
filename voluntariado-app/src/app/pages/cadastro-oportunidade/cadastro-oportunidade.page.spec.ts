import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CadastroOportunidadePage } from './cadastro-oportunidade.page';

describe('CadastroOportunidadePage', () => {
  let component: CadastroOportunidadePage;
  let fixture: ComponentFixture<CadastroOportunidadePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CadastroOportunidadePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
