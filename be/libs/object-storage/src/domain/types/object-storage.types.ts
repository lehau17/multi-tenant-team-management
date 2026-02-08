
export interface ObjectStorageOptions {
    strategy: 's3' | 'local';
    accessKeyId?: string;
    secretAccessKey?: string;
    region?: string;
    bucket?: string;
    endpoint?: string;
    forcePathStyle?: boolean;
}
