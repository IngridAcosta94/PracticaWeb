import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalImagePlayerComponent } from './modalImgPlayer.component';

describe('ModalImagePlayerComponent', () => {
  let component: ModalImagePlayerComponent;
  let fixture: ComponentFixture<ModalImagePlayerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalImagePlayerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalImagePlayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
