import { Injectable } from "@nestjs/common";
import * as bcrypt from "bcrypt"; // ✅ Nên import thế này để tránh lỗi undefined
import { IPasswordHaser } from "../../domain/port/password-hasher.port";

@Injectable()
export class PasswordHasher implements IPasswordHaser {

  async hash(plaintext: string, salt: string): Promise<string> {
    return bcrypt.hash(plaintext, salt);
  }

  // ✅ Bcrypt tự lấy salt từ trong hashPassword để so sánh
  async compare(plaintext: string, hashPassword: string): Promise<boolean> {
    return bcrypt.compare(plaintext, hashPassword);
  }

  async salt(): Promise<string> {
    return bcrypt.genSalt();
  }
}
