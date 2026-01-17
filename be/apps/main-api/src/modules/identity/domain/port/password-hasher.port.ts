

export const PASSWORD_HASHER = Symbol("IPasswordHasher")

export interface IPasswordHaser {
  hash(plaintext: string, salt: string): Promise<string>
  compare(plaintext: string, hashPassword: string): Promise<boolean>
  salt() : Promise<string>
}
