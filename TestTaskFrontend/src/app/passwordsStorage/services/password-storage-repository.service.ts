import { Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { PasswordEntry, PasswordTypes } from '../model/password-entry';
import { AddPasswordError, GetPasswordValueError, IPasswordStorageRepositoryService } from './password-storage-resository.interface';
import { IPasswordStorageService } from './password-storage.interface';
import { operationFailure, OperationResult, operationSuccess } from '../../shared/utils/operation-result';

import { GetPasswordValueError as ServiceGetPasswordValueError, AddPasswordError as ServiceAddPasswordError } from './password-storage.interface';

@Injectable()
export class PasswordStorageRepositoryService extends IPasswordStorageRepositoryService {
  protected dataProvider : IPasswordStorageService;

  constructor(dataProvider: IPasswordStorageService)
  {
    super();
    this.dataProvider = dataProvider;
  }

  override getPasswords(filter: string) : Observable<OperationResult<PasswordEntry[]>> {
    return this.dataProvider.getPasswords(filter).pipe(
      map(result => {
        if (result.success)
          return operationSuccess(result.result);
        else
          return operationFailure();
      }),
      catchError((err, caught) => {
        return of(operationFailure());
      })
    );
  }

  override getPasswordValue(record: PasswordEntry) : Observable<OperationResult<string, GetPasswordValueError>>
  {
    return this.dataProvider.getPasswordValue(record.id).pipe(
      map(result => {
        if (result.success)
          return operationSuccess(result.result);
        else
          return operationFailure(
            result.error == ServiceGetPasswordValueError.InvalidPasswordId ?
            GetPasswordValueError.InvalidRecord :
            GetPasswordValueError.ServiceError );
      }),
      catchError((err, caught) => {
        return of(operationFailure(GetPasswordValueError.ServiceError));
      })
    );
  }

  override addPassword(type: PasswordTypes, passwordFor: string, password: string) : Observable<OperationResult<PasswordEntry, AddPasswordError>> {
    return this.dataProvider.addPassword(type, passwordFor, password).pipe(
      map(result => {
        if (result.success)
          return operationSuccess(result.result);
        else
          return operationFailure(
            result.error == ServiceAddPasswordError.DuplicatePassword ?
            AddPasswordError.DuplicatePassword :
            AddPasswordError.ServiceError );
      }),
      catchError((err, caught) => {
        return of(operationFailure(AddPasswordError.ServiceError));
      })
    );
  }
}
