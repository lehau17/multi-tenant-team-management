import { PaginationQuery } from "./cqrs-core/base-query-pagination.base";

export class BaseResponse<T> {
  status: number | string;
  data: T | null;

  constructor(status: number | string, data: T | null) {
    this.status = status;
    this.data = data;
  }

  static ok<T>(data: T): BaseResponse<T> {
    return new BaseResponse(200, data);
  }

  static created<T>(data: T | null): BaseResponse<T> {
    return new BaseResponse(201, data);
  }
  static noContext(): BaseResponse<null>{
    return new BaseResponse(204,null )
  }

  static pagination<T>(data: T[], total: number, query: PaginationQuery): PaginationResponse<T> {
    const pagination = new Pagination<T>(data, total, query);

    return new PaginationResponse(pagination);
  }
}

export class Pagination<T> {
  public meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  public items: T[]; // Đổi tên 'objects' thành 'items' cho chuẩn chung

  constructor(data: T[], total: number, query: PaginationQuery) {
    this.items = data;
    this.meta = {
      total: total || 0,
      page: Number(query.page) || 1,
      limit: Number(query.limit) || 10,
      totalPages: Math.ceil((total || 0) / (Number(query.limit) || 10)),
    };
  }
}

export class PaginationResponse<T> extends BaseResponse<Pagination<T>> {

  constructor(pagination: Pagination<T>) {
      super(200, pagination);
    }
  static of<T>(data: T[], total: number, query: PaginationQuery): PaginationResponse<T> {
      const pagination = new Pagination<T>(data, total, query);
      return new PaginationResponse<T>(pagination);
    }

  static fromPagination<T>(pagination: Pagination<T>): PaginationResponse<T> {
      return new PaginationResponse<T>(pagination);
    }
}
