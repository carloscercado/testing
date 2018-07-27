/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { Create_wishComponent } from './create_wish.component';

describe('Create_wishComponent', () => {
  let component: Create_wishComponent;
  let fixture: ComponentFixture<Create_wishComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Create_wishComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Create_wishComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
