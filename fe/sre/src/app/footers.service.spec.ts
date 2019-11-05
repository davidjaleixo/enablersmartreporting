import { TestBed, inject } from '@angular/core/testing';

import { FootersService } from './footers.service';

describe('FootersService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FootersService]
    });
  });

  it('should be created', inject([FootersService], (service: FootersService) => {
    expect(service).toBeTruthy();
  }));
});
