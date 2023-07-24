/**
 * Response의 ErrorCode를 활용할 수 있는 형태의 Error 정의.
 */
export class CustomError extends Error {
  /**
   *
   * @param {string} errorCode - ErrorCode에 정의된 errorCode
   * @param {string} message
   * @param {any} info
   */
  errorCode: string;

  info: any;

  constructor(errorCode: string, message: string, info?: any) {
    super(message);
    this.errorCode = errorCode;
    this.info = info;
    Error.captureStackTrace(this, this.constructor);
  }
}
