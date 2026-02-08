
export const UploadPortToken = Symbol('UploadPort');

export interface IUploadPort {
    upload(file: Express.Multer.File, folder?: string): Promise<string>;
}