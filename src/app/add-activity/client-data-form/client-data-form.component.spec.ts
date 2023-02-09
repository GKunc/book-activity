import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientDataFormComponent } from './client-data-form.component';

describe('ClientDataFormComponent', () => {
  let component: ClientDataFormComponent;
  let fixture: ComponentFixture<ClientDataFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClientDataFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientDataFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
