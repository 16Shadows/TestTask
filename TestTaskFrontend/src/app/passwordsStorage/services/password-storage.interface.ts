import { Observable } from 'rxjs';
import { PasswordEntry } from '../model/password-entry';

export abstract class IPasswordStorageService {
  abstract getPasswords(filter?: string) : Observable<PasswordEntry[]>;
  abstract getPasswordValue(id: number) : Observable<string>;
}
