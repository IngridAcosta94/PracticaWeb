import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndexSeasonComponent } from './IndexSeason.component';

describe('IndexSeasonComponent', () => {
  let component: IndexSeasonComponent;
  let fixture: ComponentFixture<IndexSeasonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IndexSeasonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IndexSeasonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
