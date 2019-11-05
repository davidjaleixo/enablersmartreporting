import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DatasourceTablesComponent } from './datasource-tables.component';

describe('DatasourceTablesComponent', () => {
  let component: DatasourceTablesComponent;
  let fixture: ComponentFixture<DatasourceTablesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DatasourceTablesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatasourceTablesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
