import { createHmac, timingSafeEqual } from 'node:crypto';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

interface MediaToken {
  /** Storage key. */
  k: string;
  /** Expiry, unix seconds. */
  e: number;
}

/**
 * Short-lived signed URLs for private storage objects. The bytes are served
 * by `MediaController`, so the bucket stays private and every image request
 * is rate-limited (BUSINESS_LOGIC §11).
 */
@Injectable()
export class MediaUrlService {
  private readonly secret: string;
  private readonly baseUrl: string;

  constructor(config: ConfigService) {
    this.secret = `media:${config.getOrThrow<string>('JWT_SECRET')}`;
    this.baseUrl = config
      .get<string>('PUBLIC_API_URL', 'http://localhost:3000')
      .replace(/\/$/, '');
  }

  /** Absolute URL valid for `ttlSeconds`; null for a missing key. */
  sign(key: string | null | undefined, ttlSeconds: number): string | null {
    if (!key) {
      return null;
    }
    // Rounded expiry keeps URLs stable for a while, so browsers can cache them.
    const bucket = 300;
    const expires =
      Math.ceil((Date.now() / 1000 + ttlSeconds) / bucket) * bucket;
    const payload = Buffer.from(
      JSON.stringify({ k: key, e: expires } satisfies MediaToken),
    ).toString('base64url');
    return `${this.baseUrl}/api/media/${payload}.${this.signature(payload)}`;
  }

  /** The storage key of a valid, unexpired token; otherwise null. */
  verify(token: string): string | null {
    const [payload, signature] = token.split('.');
    if (!payload || !signature) {
      return null;
    }
    const expected = Buffer.from(this.signature(payload));
    const given = Buffer.from(signature);
    if (expected.length !== given.length || !timingSafeEqual(expected, given)) {
      return null;
    }
    try {
      const { k, e } = JSON.parse(
        Buffer.from(payload, 'base64url').toString(),
      ) as MediaToken;
      return typeof k === 'string' && e * 1000 > Date.now() ? k : null;
    } catch {
      return null;
    }
  }

  private signature(payload: string) {
    return createHmac('sha256', this.secret)
      .update(payload)
      .digest('base64url');
  }
}
