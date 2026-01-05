import { IQuery } from "@nestjs/cqrs";

export interface IPaginationOptions {
  page?: number;
  limit?: number;
  sortOrder?: 'ASC' | 'DESC';
}

export class PaginationQuery implements IQuery {
  public readonly limit: number;
  public readonly page: number;
  public readonly sortOrder: 'ASC' | 'DESC';

  constructor(options: IPaginationOptions = {}) {
    this.limit = options.limit ? Number(options.limit) : 10;
    this.page = options.page ? Number(options.page) : 1;
    this.sortOrder = options.sortOrder || 'DESC';
  }

  // Helper: Tính toán sẵn offset cho TypeORM dùng luôn (skip)
  get skip(): number {
    return (this.page - 1) * this.limit;
  }
}
