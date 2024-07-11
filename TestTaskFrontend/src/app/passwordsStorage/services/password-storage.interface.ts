import { Observable } from 'rxjs';
import { PasswordEntry, PasswordTypes } from '../model/password-entry';
import { OperationResult } from '../../shared/utils/operation-result';

export const GetPasswordValueError = {
  /**
   * Неверный id пароля
   */
  InvalidPasswordId: 'InvalidPasswordId',
  /**
   * Неожиданная внутренняя ошибка сервиса
   */
  ServiceError: 'ServiceError'
} as const;
export type GetPasswordValueError = typeof GetPasswordValueError[keyof typeof GetPasswordValueError];

export const AddPasswordError = {
  /**
   * Такой пароль уже существует
   */
  DuplicatePassword: 'DuplicatePassword',
  /**
   * Неожиданная внутренняя ошибка сервиса
   */
  ServiceError: 'ServiceError'
} as const;
export type AddPasswordError = typeof AddPasswordError[keyof typeof AddPasswordError];

export abstract class IPasswordStorageService {
  /**
   * Получает весь список паролей, содержащих указанную подстроку
   * @param filter Подстрока, наличие которой необходимо в пароли
   */
  abstract getPasswords(filter?: string) : Observable<OperationResult<PasswordEntry[]>>;
  /**
   * Получает значение указанного пароля.
   * @param id Id пароля, значение которого необходимо получить.
   */
  abstract getPasswordValue(id: number) : Observable<OperationResult<string, GetPasswordValueError>>;
  /**
   * Добавляет пароль указанного типа
   * @param type Тип пароля
   * @param passwordFor Наименование пароля
   * @param password Значение пароля
   */
  abstract addPassword(type: PasswordTypes, passwordFor: string, password: string) : Observable<OperationResult<PasswordEntry, AddPasswordError>>;
}
