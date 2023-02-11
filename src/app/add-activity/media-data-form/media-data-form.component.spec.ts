import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MediaDataFormComponent } from './media-data-form.component';

describe('MediaDataFormComponent', () => {
  let component: MediaDataFormComponent;
  let fixture: ComponentFixture<MediaDataFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MediaDataFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MediaDataFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
