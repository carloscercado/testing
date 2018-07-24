import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PymesComponent } from './pymes.component';

describe('PymesComponent', () => {
  let component: PymesComponent;
  let fixture: ComponentFixture<PymesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PymesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PymesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
