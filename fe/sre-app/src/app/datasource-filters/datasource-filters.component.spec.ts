import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DatasourceFiltersComponent } from './datasource-filters.component';

describe('DatasourceFiltersComponent', () => {
  let component: DatasourceFiltersComponent;
  let fixture: ComponentFixture<DatasourceFiltersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DatasourceFiltersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatasourceFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
