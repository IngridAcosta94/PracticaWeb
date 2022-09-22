import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalReleasePlayerComponent } from './modalReleasePlayer.component';

describe('ModalReleasePlayerComponent', () => {
  let component: ModalReleasePlayerComponent;
  let fixture: ComponentFixture<ModalReleasePlayerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalReleasePlayerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalReleasePlayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
