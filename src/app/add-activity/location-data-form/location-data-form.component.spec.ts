import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationDataFormComponent } from './location-data-form.component';

describe('LocationDataFormComponent', () => {
  let component: LocationDataFormComponent;
  let fixture: ComponentFixture<LocationDataFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LocationDataFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LocationDataFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
