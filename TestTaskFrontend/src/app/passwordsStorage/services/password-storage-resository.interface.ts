import { Observable } from "rxjs";
import { PasswordEntry, PasswordTypes } from "../model/password-entry";
import { OperationResult } from "../../shared/utils/operation-result";

export const GetPasswordValueError = {
  /**
   * Запись несуществующего пароля
   */
  InvalidRecord: 'InvalidRecord',
  /**
   * Неожиданная внутренняя ошибка сервиса
   */
  ServiceError: 'ServiceError'
} as const;
export type GetPasswordValueError = typeof GetPasswordValueError[keyof typeof GetPasswordValueError];

export const AddPasswordError = {
  /**
   * Такой пароль уже есть
   */
  DuplicatePassword: 'DuplicatePassword',
  /**
   * Неожиданная внутренняя ошибка сервиса
   */
  ServiceError: 'ServiceError'
} as const;
export type AddPasswordError = typeof AddPasswordError[keyof typeof AddPasswordError];

export abstract class IPasswordStorageRepositoryService {
  /**
   * Получает весь список паролей, содержащих указанную подстроку
   * @param filter Подстрока, наличие которой необходимо в пароли
   */
  abstract getPasswords(filter: string) : Observable<OperationResult<PasswordEntry[]>>;
  /**
   * Получает значение указанного пароля.
   * @param record запись пароля, значение которого необходимо получить.
   */
  abstract getPasswordValue(record: PasswordEntry) : Observable<OperationResult<string, GetPasswordValueError>>;
  /**
   * Добавляет пароль указанного типа
   * @param type Тип пароля
   * @param passwordFor Наименование пароля
   * @param password Значение пароля
   */
  abstract addPassword(type: PasswordTypes, passwordFor: string, password: string) : Observable<OperationResult<PasswordEntry, AddPasswordError>>;
}