import { HttpClient, HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of, throwError } from 'rxjs';
import { PasswordEntry, PasswordTypes } from '../model/password-entry';
import { AddPasswordError, GetPasswordValueError, IPasswordStorageService } from './password-storage.interface';
import { operationFailure, OperationResult, operationSuccess } from '../../shared/utils/operation-result';

@Injectable()
export class PasswordStorageService extends IPasswordStorageService {
  protected httpClient: HttpClient;

  constructor(httpClient: HttpClient) 
  {
    super();
    this.httpClient = httpClient;
  }

  override getPasswords(filter?: string) : Observable<OperationResult<PasswordEntry[]>> {
    return this.httpClient.get<PasswordEntry[]>(`/api/passwords?filter=${filter ?? ''}`).pipe(
      map(arr => {
        for (var item of arr)
          item.creationTime = new Date((item.creationTime as any as number)*1000); //Преобразуем timestamp в объект Date
        return operationSuccess(arr);
      }),
      catchError((err, caught) => {
        return of(operationFailure());
      })
    );
  }

  override getPasswordValue(id: number) : Observable<OperationResult<string, GetPasswordValueError>> {
    return this.httpClient.get<string>(`/api/passwords/${id}/password`).pipe(
      map(value => {
        return operationSuccess(value);
      }),
      catchError((err, caught) => {
        if (err instanceof HttpErrorResponse)
          return of(operationFailure(err.status == HttpStatusCode.NotFound ? GetPasswordValueError.InvalidPasswordId : GetPasswordValueError.ServiceError));
        return throwError(() => err);
      })
    );
  }

  override addPassword(type: PasswordTypes, passwordFor: string, password: string) : Observable<OperationResult<PasswordEntry, AddPasswordError>> {
    return this.httpClient.post<PasswordEntry>('/api/passwords', {
      passwordType: type,
      passwordFor: passwordFor,
      password: password
    }).pipe(
      map(item => {
        item.creationTime = new Date((item.creationTime as any as number)*1000); //Преобразуем timestamp в объект Date
        return operationSuccess(item);
      }),
      catchError((err, caught) => {
        if (err instanceof HttpErrorResponse)
          return of(operationFailure(err.status == HttpStatusCode.Conflict ? AddPasswordError.DuplicatePassword : AddPasswordError.ServiceError));
        return throwError(() => err);
      })
    );
  }
}
