import { Injectable } from '@nestjs/common';
import { ClassConstructor, plainToInstance } from 'class-transformer';
import { isEmail, validate } from 'class-validator';

import { LoggerService } from '@app/common';
import { CustomError } from '../../error';

import * as CONSTANTS from '../../../../constants';

export const CUSTOM_TYPE = {
  EMAIL: 'email',
} as const;

type TCustomType = (typeof CUSTOM_TYPE)[keyof typeof CUSTOM_TYPE];

type TPrimitive = 'number' | 'string' | 'boolean';

type TValidateProperty<T> = {
  type: ClassConstructor<T> | TPrimitive | TCustomType;
  value: any;
};

const isTPrimitive = (param: any): param is TPrimitive => {
  return param === 'number' || param === 'string' || param === 'boolean';
};

const isTCustomType = (param: any): param is TCustomType => {
  return param === 'email';
};

@Injectable()
export class ValidationService {
  constructor(private readonly logger: LoggerService) {}

  private _validateEmail(email: string): boolean {
    if (!isEmail(email)) {
      this.logger.error(`Invalid email address error! (input value: ${email})`);
      return false;
    }
    return true;
  }

  // NOTE: custom한 벨리데이션도 추가할 수 있음
  private _customTypeValidationMap = {
    [CUSTOM_TYPE.EMAIL]: (param) => this._validateEmail(param),
  };

  async validate(...args: TValidateProperty<object>[]) {
    const validationWork = args.map(async (arg) => {
      const { type, value } = arg;

      if (isTPrimitive(type)) {
        if (typeof value !== type) {
          this.logger.error(
            `primitive type error! (expected type: ${type}, input value: ${value})`,
          );
          throw new CustomError(
            CONSTANTS.SYSTEM.ERROR.ERROR_CODE.VALIDATION_ERROR,
            `primitive type error!`,
          );
        }
        return true;
      }

      if (isTCustomType(type)) {
        const validated: boolean = this._customTypeValidationMap[type](value);
        if (!validated) {
          throw new CustomError(
            CONSTANTS.SYSTEM.ERROR.ERROR_CODE.VALIDATION_ERROR,
            `customType type error!`,
          );
        }
        return true;
      }

      const plain = plainToInstance(type as ClassConstructor<object>, value, {
        exposeUnsetFields: false,
      });
      const validated = await validate(plain, { whitelist: true });
      if (validated && validated.length > 0) {
        this.logger.error(
          validated,
          `schema validation error! (input value: ${value})`,
        );
        throw new CustomError(
          CONSTANTS.SYSTEM.ERROR.ERROR_CODE.VALIDATION_ERROR,
          'validation error!',
        );
      }
    });

    await Promise.all(validationWork);
  }
}
