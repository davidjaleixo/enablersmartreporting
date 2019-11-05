import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplatesdetailComponent } from './templatesdetail.component';

describe('TemplatesdetailComponent', () => {
  let component: TemplatesdetailComponent;
  let fixture: ComponentFixture<TemplatesdetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TemplatesdetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TemplatesdetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
