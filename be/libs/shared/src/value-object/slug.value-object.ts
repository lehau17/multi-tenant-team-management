import defaultSlugify from 'slugify';
import { ValueObject } from "../core";
import { DomainException } from "../error/error-exception";
export interface ISlugProps {
  value: string;
}

export class SlugVo extends ValueObject<ISlugProps> {

  constructor(props: ISlugProps) {
    super(props);
  }

  // Getter để lấy giá trị chuỗi slug ra dùng
  get value(): string {
    return this.props.value;
  }

  /**
   * Factory method tạo Slug từ Name và ID
   * @param name Tên (VD: "Hitek Software")
   * @param id ID (VD: "550e8400-e29b...")
   */
  static create(name: string, id: string): SlugVo {
    if (!name) throw new DomainException("Name để tạo slug không được rỗng");
    if (!id) throw new DomainException("ID để tạo slug không được rỗng");

    // 1. Tạo slug từ tên (VD: "Hitek Software" -> "hitek-software")
    const nameSlug = defaultSlugify(name, {
      lower: true,      // Chữ thường
      strict: true,     // Loại bỏ ký tự đặc biệt
      trim: true,       // Cắt khoảng trắng
      locale: 'vi'      // Hỗ trợ tiếng Việt (đ->d)
    });

    // 2. Nối ID vào "đít" để đảm bảo Unique
    // VD: "hitek-software-550e8400-e29b..."
    // Mẹo: Nếu ID là UUID quá dài, bạn có thể chỉ lấy 8 ký tự đầu: id.split('-')[0]
    const fullSlug = `${nameSlug}-${id}`;

    return new SlugVo({ value: fullSlug });
  }

  /**
   * Trường hợp load từ DB lên (Slug đã có sẵn, không cần gen lại)
   */
  static load(existingSlug: string): SlugVo {
      if(!existingSlug) throw new DomainException("Slug rỗng");
      return new SlugVo({ value: existingSlug });
  }
}
