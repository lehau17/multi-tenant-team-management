import { Logger } from '@nestjs/common';

export enum RetryStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  RETRYING = 'retrying',
  SUCCESS = 'success',
  FAILED = 'failed',
}

export interface RetryResult<T> {
  status: RetryStatus;
  data?: T;
  error?: Error;
  attempts: number;
}

export interface RetryOptions {
  maxRetries?: number;
  baseDelayMs?: number;
  maxDelayMs?: number;
  async?: boolean;
  onStatusChange?: (status: RetryStatus, attempt: number, error?: Error) => void;
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
  ): Promise<RetryResult<T>> {
    const maxRetries = this.getMaxRetries(options);
    const baseDelayMs = this.getBaseDelayMs(options);
    const maxDelayMs = this.getMaxDelayMs(options);
    const isAsync = options.async ?? true;

    if (isAsync) {
      return this.executeAsync(fn, maxRetries, baseDelayMs, maxDelayMs, options);
    }

    return this.executeSync(fn, maxRetries, baseDelayMs, maxDelayMs, options);
  }

  static executeInBackground<T>(
    fn: () => Promise<T>,
    options: RetryOptions = {},
  ): { promise: Promise<RetryResult<T>>; getStatus: () => RetryStatus } {
    let currentStatus: RetryStatus = RetryStatus.PENDING;

    const wrappedOptions: RetryOptions = {
      ...options,
      onStatusChange: (status, attempt, error) => {
        currentStatus = status;
        options.onStatusChange?.(status, attempt, error);
      },
    };

    const promise = this.execute(fn, wrappedOptions);

    return {
      promise,
      getStatus: () => currentStatus,
    };
  }

  private static async executeAsync<T>(
    fn: () => Promise<T>,
    maxRetries: number,
    baseDelayMs: number,
    maxDelayMs: number,
    options: RetryOptions,
  ): Promise<RetryResult<T>> {
    let lastError: Error;
    let attempt = 0;

    this.notifyStatusChange(options, RetryStatus.PENDING, 0);

    for (attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const status = attempt === 1 ? RetryStatus.PROCESSING : RetryStatus.RETRYING;
        this.notifyStatusChange(options, status, attempt);

        const data = await fn();

        this.notifyStatusChange(options, RetryStatus.SUCCESS, attempt);

        return {
          status: RetryStatus.SUCCESS,
          data,
          attempts: attempt,
        };
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));

        if (attempt === maxRetries) {
          this.logger.error(
            `All ${maxRetries} retry attempts failed: ${lastError.message}`,
          );

          this.notifyStatusChange(options, RetryStatus.FAILED, attempt, lastError);

          return {
            status: RetryStatus.FAILED,
            error: lastError,
            attempts: attempt,
          };
        }

        const delay = this.calculateDelay(attempt, baseDelayMs, maxDelayMs);
        this.handleRetry(lastError, attempt, maxRetries, delay, options.onRetry);
        await this.sleep(delay);
      }
    }

    return {
      status: RetryStatus.FAILED,
      error: lastError!,
      attempts: attempt,
    };
  }

  private static executeSync<T>(
    fn: () => Promise<T>,
    maxRetries: number,
    baseDelayMs: number,
    maxDelayMs: number,
    options: RetryOptions,
  ): Promise<RetryResult<T>> {
    return new Promise((resolve) => {
      this.executeAsync(fn, maxRetries, baseDelayMs, maxDelayMs, options)
        .then(resolve)
        .catch((error) => {
          resolve({
            status: RetryStatus.FAILED,
            error: error instanceof Error ? error : new Error(String(error)),
            attempts: maxRetries,
          });
        });
    });
  }

  private static notifyStatusChange(
    options: RetryOptions,
    status: RetryStatus,
    attempt: number,
    error?: Error,
  ): void {
    options.onStatusChange?.(status, attempt, error);
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
