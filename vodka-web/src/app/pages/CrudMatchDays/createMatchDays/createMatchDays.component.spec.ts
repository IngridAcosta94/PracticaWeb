import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateMatchDaysComponent } from './createMatchDays.component';

describe('CreateComponent', () => {
  let component: CreateMatchDaysComponent;
  let fixture: ComponentFixture<CreateMatchDaysComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateMatchDaysComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateMatchDaysComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
