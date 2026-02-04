import { HttpException } from "@nestjs/common"



// export type
const MAX_RETRY_TIMES = 5

const MAX_DEPLAY_TIMES = 5000 // ms

const BASE_DEPLAY_TIMES = 200 //ms

export class RetryStategyV2 {


  private retryTimes: number
  private deplayTimes: number
  private maxDeplayTimes: number



  constructor() {
    this.retryTimes = 0
    this.deplayTimes = parseInt(process.env.BASE_DEPLAY_TIMES) ?? BASE_DEPLAY_TIMES
    this.maxDeplayTimes = parseInt(process.env.MAX_DEPLAY_TIMES) ?? MAX_DEPLAY_TIMES
  }

  async execute<T>(
    fn: () => Promise<T>,
    options: any
  ): Promise<T> {

    try {
      const result = await Promise.race([fn(), this.timeout()])
      return result as T
    } catch (error) {
      // Handle Retry
      if (this.deplayTimes < this.maxDeplayTimes && this.shoundRetry(error)) {
        this.retryTimes++
       await this.sleep(this.timeSleep())
        return await this.execute(fn, options)
      }
      throw error
    }



  }

  private timeSleep(): number {
    return Math.min(this.deplayTimes * this.retryTimes,this.maxDeplayTimes)
  }

  private shoundRetry(error: any): boolean {
    // CASE TIMEOUT
     if (error instanceof Error && error.message === "TIMEOUT") {
       return true
     }
    // CASE Call API
    if (error instanceof HttpException && (error.getStatus() === 503 || error.getStatus() === 500)) {
      return true
    }

    return false

  }


  private async sleep(timesMs: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, timesMs))
  }

private async timeout(): Promise<void> {
    return new Promise((_, reject) => {
      setTimeout(
        () => reject(new Error(`TIMEOUT`)),
        this.maxDeplayTimes
      );
    });
  }


}
