export interface RunResult {
  success: boolean
  data: any
  error?: Error
}

export default abstract class Task {
  constructor() {}

  abstract action(data?: any, seed?: any): void

  public succeed(data: any): RunResult {
    return {
      success: true,
      data,
    }
  }

  public fail(error: Error): RunResult {
    return {
      success: false,
      data: null,
      error,
    }
  }

  public async run(seed?: any, lastResult?: any): Promise<RunResult> {
    try {
      const result = await this.action(seed, lastResult)
      return this.succeed(result)
    } catch (e) {
      return this.fail(e)
    }
  }
}
/*success(data): marks the task as successful and emits a success event with the data passed to it
fail(error, errorMessage): marks the task as failed, stops the current job and emits a fail event with the error object and error message passed
share(key, value, [options]): shares a value to tasks in the next execution block*/
