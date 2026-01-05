import { validate as isValidUUID } from 'uuid';
import { ValueObject } from '../core';
import { DomainException } from '../error/error-exception';

export enum ID_TYPE {
  AUTO_INCREMENT = 'AUTO_INCREMENT',
  UUID = 'UUID'
}

export interface IIdVoProps {
  value: string | number;
  type: ID_TYPE;
}

export class IdVo extends ValueObject<IIdVoProps> {
  private constructor(props: IIdVoProps) {
    super(props);
  }

  get value(): string | number {
    return this.props.value;
  }

  static create(id: string | number, type: ID_TYPE): IdVo {
    this.validate(id, type);
    return new IdVo({ value: id, type });
  }

  // Tách hàm validate ra cho gọn
  private static validate(id: string | number, type: ID_TYPE): void {
    switch (type) {
      case ID_TYPE.AUTO_INCREMENT:
        const num = Number(id);
        if (isNaN(num)) {
          throw new DomainException("ID Auto-Increment phải là số");
        }
        if (num <= 0 || !Number.isInteger(num)) {
           throw new DomainException("ID phải là số nguyên dương");
        }
        break;

      case ID_TYPE.UUID:
        if (typeof id !== 'string') {
           throw new DomainException("UUID ID phải là chuỗi ký tự");
        }
        if (!isValidUUID(id)) {
          throw new DomainException("UUID không đúng định dạng");
        }
        break;

      default:
        throw new DomainException("Loại ID không được hỗ trợ");
    }
  }
}
