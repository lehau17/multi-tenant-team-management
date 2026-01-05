import { ValueObject } from "../core";
import { DomainException } from "../error/error-exception";

export interface IDomainVoProps {
  value: string;
}

export class DomainVo extends ValueObject<IDomainVoProps> {
  // Regex check domain chuẩn (hỗ trợ cả subdomain)
  // VD: google.com, api.test.co.uk, localhost
  private static readonly DOMAIN_REGEX =
    /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]$|^localhost$/;

  private constructor(props: IDomainVoProps) {
    super(props);
  }

  get value(): string {
    return this.props.value;
  }

  public static create(domain: string): DomainVo {
    if (!domain) {
      throw new DomainException("Domain không được để trống");
    }

    // 1. Sanitize: Cắt khoảng trắng, chuyển về chữ thường
    let cleanedDomain = domain.trim().toLowerCase();

    // 2. Loại bỏ protocol nếu lỡ user nhập (http://, https://)
    cleanedDomain = cleanedDomain.replace(/^(https?:\/\/)/, '').replace(/\/$/, '');

    // 3. Validate
    if (!this.validate(cleanedDomain)) {
      throw new DomainException(`Domain '${cleanedDomain}' không hợp lệ. (Ví dụ đúng: example.com)`);
    }

    return new DomainVo({ value: cleanedDomain });
  }

  private static validate(domain: string): boolean {
    return this.DOMAIN_REGEX.test(domain);
  }
}
