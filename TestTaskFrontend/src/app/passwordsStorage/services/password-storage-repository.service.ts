import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PasswordEntry } from '../model/password-entry';
import { IPasswordStorageRepositoryService } from './password-storage-resository.interface';
import { IPasswordStorageService } from './password-storage.interface';

@Injectable()
export class PasswordStorageRepositoryService extends IPasswordStorageRepositoryService {
  protected dataProvider : IPasswordStorageService;

  constructor(dataProvider: IPasswordStorageService)
  {
    super();
    this.dataProvider = dataProvider;
  }

  override getPasswords(filter: string) : Observable<PasswordEntry[]> {
    return this.dataProvider.getPasswords(filter);
  }

  override getPasswordValue(record: PasswordEntry) : Observable<string>
  {
    return this.dataProvider.getPasswordValue(record.id);
  }
}
