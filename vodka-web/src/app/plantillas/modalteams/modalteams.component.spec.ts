import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalteamsComponent } from './modalteams.component';

describe('ModalteamsComponent', () => {
  let component: ModalteamsComponent;
  let fixture: ComponentFixture<ModalteamsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalteamsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalteamsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
