export interface RunResult{
  success: boolean;
  data: any;
  error?: Error;
}

export default abstract class Task {
  private taskPromise : Promise<any>
  private resolvePromise : Function

  constructor() {
    // tslint:disable-next-line promise-must-complete
    this.taskPromise = new Promise((resolve: Function) => {
      this.resolvePromise = resolve
    })
  }

  abstract action(data?: any, seed?: any): void

  public succeed(data: any) : void {
    this.resolvePromise({
      success: true,
      data
    })
  }

  public fail(error: Error) : void {
    this.resolvePromise({
      success: false,
      data: null,
      error
    })
  }

  public run(seed?: any, lastResult?: any) : Promise<RunResult> {
    this.action(seed, lastResult)
    return this.taskPromise
  }
}
  /*success(data): marks the task as successful and emits a success event with the data passed to it
fail(error, errorMessage): marks the task as failed, stops the current job and emits a fail event with the error object and error message passed
share(key, value, [options]): shares a value to tasks in the next execution block*/
