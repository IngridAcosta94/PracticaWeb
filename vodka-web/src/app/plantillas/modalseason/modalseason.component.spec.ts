import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalseasonComponent } from './modalseason.component';

describe('ModalseasonComponent', () => {
  let component: ModalseasonComponent;
  let fixture: ComponentFixture<ModalseasonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalseasonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalseasonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
