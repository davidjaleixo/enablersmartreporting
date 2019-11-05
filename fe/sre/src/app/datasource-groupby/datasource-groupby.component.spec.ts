import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DatasourceGroupbyComponent } from './datasource-groupby.component';

describe('DatasourceGroupbyComponent', () => {
  let component: DatasourceGroupbyComponent;
  let fixture: ComponentFixture<DatasourceGroupbyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DatasourceGroupbyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatasourceGroupbyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
