import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DatasourceRelationComponent } from './datasource-relation.component';

describe('DatasourceRelationComponent', () => {
  let component: DatasourceRelationComponent;
  let fixture: ComponentFixture<DatasourceRelationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DatasourceRelationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatasourceRelationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
