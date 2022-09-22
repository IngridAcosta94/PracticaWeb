import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteCedulaComponent } from './reporteCedula.component';

describe('ReporteCedulaComponent', () => {
  let component: ReporteCedulaComponent;
  let fixture: ComponentFixture<ReporteCedulaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReporteCedulaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReporteCedulaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
