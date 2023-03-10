import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DirectivaComponent } from './directiva.component';

describe('DirectivaComponent', () => {
  let component: DirectivaComponent;
  let fixture: ComponentFixture<DirectivaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DirectivaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DirectivaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
