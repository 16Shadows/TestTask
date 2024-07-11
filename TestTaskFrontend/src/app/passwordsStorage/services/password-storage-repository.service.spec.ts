import { TestBed } from '@angular/core/testing';

import { PasswordStorageRepositoryService } from './password-storage-repository.service';

describe('PasswordStorageRepositoryService', () => {
  let service: PasswordStorageRepositoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PasswordStorageRepositoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
