import { Logger } from '@nestjs/common';

export interface RetryOptions {
  maxRetries?: number;
  baseDelayMs?: number;
  maxDelayMs?: number;
  onRetry?: (error: Error, attempt: number) => void;
}

export class RetryStrategy {
  private static readonly logger = new Logger(RetryStrategy.name);
  private static readonly DEFAULT_MAX_RETRIES = 10;
  private static readonly DEFAULT_BASE_DELAY_MS = 100;
  private static readonly DEFAULT_MAX_DELAY_MS = 5000;

  static async execute<T>(
    fn: () => Promise<T>,
    options: RetryOptions = {},
  ): Promise<T> {
    const maxRetries = this.getMaxRetries(options);
    const baseDelayMs = this.getBaseDelayMs(options);
    const maxDelayMs = this.getMaxDelayMs(options);

    let lastError: Error;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));

        if (attempt === maxRetries) {
          this.logger.error(
            `All ${maxRetries} retry attempts failed: ${lastError.message}`,
          );
          throw lastError;
        }

        const delay = this.calculateDelay(attempt, baseDelayMs, maxDelayMs);
        this.handleRetry(lastError, attempt, maxRetries, delay, options.onRetry);
        await this.sleep(delay);
      }
    }

    throw lastError!;
  }

  private static getMaxRetries(options: RetryOptions): number {
    return (
      options.maxRetries ??
      (parseInt(process.env.RETRY_MAX_ATTEMPTS || '', 10) ||
        this.DEFAULT_MAX_RETRIES)
    );
  }

  private static getBaseDelayMs(options: RetryOptions): number {
    return (
      options.baseDelayMs ??
      (parseInt(process.env.RETRY_BASE_DELAY_MS || '', 10) ||
        this.DEFAULT_BASE_DELAY_MS)
    );
  }

  private static getMaxDelayMs(options: RetryOptions): number {
    return (
      options.maxDelayMs ??
      (parseInt(process.env.RETRY_MAX_DELAY_MS || '', 10) ||
        this.DEFAULT_MAX_DELAY_MS)
    );
  }

  private static calculateDelay(
    attempt: number,
    baseDelayMs: number,
    maxDelayMs: number,
  ): number {
    return Math.min(baseDelayMs * attempt, maxDelayMs);
  }

  private static handleRetry(
    error: Error,
    attempt: number,
    maxRetries: number,
    delay: number,
    onRetry?: (error: Error, attempt: number) => void,
  ): void {
    if (onRetry) {
      onRetry(error, attempt);
    } else {
      this.logger.warn(
        `Attempt ${attempt}/${maxRetries} failed: ${error.message}. Retrying in ${delay}ms...`,
      );
    }
  }

  private static sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
