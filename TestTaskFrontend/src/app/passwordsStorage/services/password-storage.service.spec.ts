import { TestBed } from '@angular/core/testing';

import { PasswordStorageService } from './password-storage.service';

describe('PasswordStorageService', () => {
  let service: PasswordStorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PasswordStorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
