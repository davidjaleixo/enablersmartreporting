import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StylesHeaderComponent } from './styles-header.component';

describe('StylesHeaderComponent', () => {
  let component: StylesHeaderComponent;
  let fixture: ComponentFixture<StylesHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StylesHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StylesHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
