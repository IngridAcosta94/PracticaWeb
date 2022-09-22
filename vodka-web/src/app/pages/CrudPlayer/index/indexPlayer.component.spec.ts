import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndexPlayerComponent } from './indexPlayer.component';

describe('IndexPlayerComponent', () => {
  let component: IndexPlayerComponent;
  let fixture: ComponentFixture<IndexPlayerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IndexPlayerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IndexPlayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
