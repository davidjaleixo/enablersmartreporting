import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConnectionsStorageComponent } from './connections-storage.component';

describe('ConnectionsStorageComponent', () => {
  let component: ConnectionsStorageComponent;
  let fixture: ComponentFixture<ConnectionsStorageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConnectionsStorageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConnectionsStorageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
