import { Observable } from "rxjs";
import { PasswordEntry } from "../model/password-entry";

export abstract class IPasswordStorageRepositoryService {
    abstract getPasswords(filter: string) : Observable<PasswordEntry[]>;
    abstract getPasswordValue(record: PasswordEntry) : Observable<string>; 
}