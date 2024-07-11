/**
 * Описывает успешную операцию.
 */
export type OperationSuccess<ResultType = undefined> = {
    /**
     * Успешна ли операция. true для OperationSuccess
     */
    success: true,
    /**
     * Результат выполнения операции
     */
    result: ResultType
};

/**
 * Описывает проваленную операцию.
 */
export type OperationFailure<ErrorType = undefined> = {
    /**
     * Успешна ли операция. false для OperationFailure.
     */
    success: false,
    /**
     * Причина провала операции.
     */
    error: ErrorType
};

export type OperationResult<ResultType = undefined, ErrorType = undefined> = OperationSuccess<ResultType> | OperationFailure<ErrorType>;

/**
 * Создаёт OperationSuccess без результата.
 */
export function operationSuccess() : OperationSuccess;
/**
 * Создаёт OperationSuccess с указанным результатом.
 * @param value Результат выполнения операции.
 */
export function operationSuccess<ResultType>(value: ResultType): OperationSuccess<ResultType>; 
export function operationSuccess<ResultType>(value?: ResultType): OperationSuccess<ResultType> | OperationSuccess {
    return value ? {
        success: true,
        result: value
    } : {
        success: true,
        result: undefined
    };
};

/**
 * Создаёт OperationFailure без ошибки.
 */
export function operationFailure() : OperationFailure;
/**
 * Создаёт OperationFailure с указанной ошибкой.
 * @param value Причина провала операции.
 */
export function operationFailure<ErrorType>(value: ErrorType): OperationFailure<ErrorType>; 
export function operationFailure<ErrorType>(value?: ErrorType): OperationFailure<ErrorType> | OperationFailure {
    return value ? {
        success: false,
        error: value
    } : {
        success: false,
        error: undefined
    };
};