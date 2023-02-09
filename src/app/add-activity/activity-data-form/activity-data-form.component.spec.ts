import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityDataFormComponent } from './activity-data-form.component';

describe('ActivityDataFormComponent', () => {
  let component: ActivityDataFormComponent;
  let fixture: ComponentFixture<ActivityDataFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActivityDataFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActivityDataFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
