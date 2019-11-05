import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConnectionsMysqlComponent } from './connections-mysql.component';

describe('ConnectionsMysqlComponent', () => {
  let component: ConnectionsMysqlComponent;
  let fixture: ComponentFixture<ConnectionsMysqlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConnectionsMysqlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConnectionsMysqlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
