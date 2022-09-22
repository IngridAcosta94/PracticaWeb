import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalPlayerComponent } from './modalPlayer.component';

describe('ModalPlayerComponent', () => {
  let component: ModalPlayerComponent;
  let fixture: ComponentFixture<ModalPlayerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalPlayerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalPlayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
