import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PasswordEntry } from '../model/password-entry';
import { IPasswordStorageService } from './password-storage.interface';

@Injectable()
export class PasswordStorageService extends IPasswordStorageService {
  protected httpClient: HttpClient;

  constructor(httpClient: HttpClient) 
  {
    super();
    this.httpClient = httpClient;
  }

  getPasswords(filter?: string) : Observable<PasswordEntry[]> {
    return this.httpClient.get<PasswordEntry[]>(`api/passwords?filter=${filter ?? ''}`);
  }
}
