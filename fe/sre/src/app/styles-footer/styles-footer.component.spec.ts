import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StylesFooterComponent } from './styles-footer.component';

describe('StylesFooterComponent', () => {
  let component: StylesFooterComponent;
  let fixture: ComponentFixture<StylesFooterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StylesFooterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StylesFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
