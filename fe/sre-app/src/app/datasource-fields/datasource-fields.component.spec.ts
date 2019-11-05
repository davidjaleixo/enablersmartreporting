import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DatasourceFieldsComponent } from './datasource-fields.component';

describe('DatasourceFieldsComponent', () => {
  let component: DatasourceFieldsComponent;
  let fixture: ComponentFixture<DatasourceFieldsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DatasourceFieldsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatasourceFieldsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
