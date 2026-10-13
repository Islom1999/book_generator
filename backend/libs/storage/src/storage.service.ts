import { mkdir, readFile, rm, stat, writeFile } from 'node:fs/promises';
import { dirname, join, resolve, sep } from 'node:path';
import {
  DeleteObjectCommand,
  GetObjectCommand,
  HeadObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';

/**
 * Private object storage used by the API (uploads, previews) and the worker
 * (generated pages, print files). Nothing in it is public: customers only
 * ever get short-lived signed preview URLs served by the API.
 */
export interface StorageDriver {
  put(key: string, body: Buffer, contentType: string): Promise<void>;
  get(key: string): Promise<Buffer>;
  exists(key: string): Promise<boolean>;
  delete(key: string): Promise<void>;
}

/** Files on disk; for development and tests. */
export class LocalStorageDriver implements StorageDriver {
  private readonly root: string;

  constructor(root: string) {
    this.root = resolve(root);
  }

  async put(key: string, body: Buffer) {
    const path = this.path(key);
    await mkdir(dirname(path), { recursive: true });
    await writeFile(path, body);
  }

  async get(key: string) {
    return readFile(this.path(key));
  }

  async exists(key: string) {
    try {
      await stat(this.path(key));
      return true;
    } catch {
      return false;
    }
  }

  async delete(key: string) {
    await rm(this.path(key), { force: true });
  }

  /** Keys never escape the root (no `..`). */
  private path(key: string) {
    const path = resolve(join(this.root, key));
    if (!path.startsWith(this.root + sep)) {
      throw new Error(`Invalid storage key: ${key}`);
    }
    return path;
  }
}

/** Any S3-compatible service (MinIO, Hetzner Object Storage, AWS). */
export class S3StorageDriver implements StorageDriver {
  constructor(
    private readonly client: S3Client,
    private readonly bucket: string,
  ) {}

  async put(key: string, body: Buffer, contentType: string) {
    await this.client.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: body,
        ContentType: contentType,
      }),
    );
  }

  async get(key: string) {
    const result = await this.client.send(
      new GetObjectCommand({ Bucket: this.bucket, Key: key }),
    );
    return Buffer.from(await result.Body!.transformToByteArray());
  }

  async exists(key: string) {
    try {
      await this.client.send(
        new HeadObjectCommand({ Bucket: this.bucket, Key: key }),
      );
      return true;
    } catch {
      return false;
    }
  }

  async delete(key: string) {
    await this.client.send(
      new DeleteObjectCommand({ Bucket: this.bucket, Key: key }),
    );
  }
}

/** `STORAGE_DRIVER=local|s3` and the matching `STORAGE_*` variables. */
export function createStorageDriver(
  env: NodeJS.ProcessEnv = process.env,
): StorageDriver {
  if ((env.STORAGE_DRIVER ?? 'local') === 'local') {
    return new LocalStorageDriver(env.STORAGE_LOCAL_DIR ?? './storage');
  }
  const client = new S3Client({
    endpoint: env.STORAGE_ENDPOINT || undefined,
    region: env.STORAGE_REGION ?? 'us-east-1',
    forcePathStyle: true,
    credentials: {
      accessKeyId: env.STORAGE_ACCESS_KEY ?? '',
      secretAccessKey: env.STORAGE_SECRET_KEY ?? '',
    },
  });
  return new S3StorageDriver(client, env.STORAGE_BUCKET ?? 'ertaklar');
}
