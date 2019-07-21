import Agent from './Agent'
import Keisatsu, { Options } from './Keisatsu'

export interface RunResult {
  success: boolean
  data: any
  error?: Error
}

export default abstract class Task {
  constructor(public hq: Keisatsu, public agent: Agent) {}

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

  public async run(
    seed?: any,
    lastResult?: any,
    options: Options = {},
  ): Promise<RunResult> {
    if (options.throwErrors) {
      const result = await this.action(seed, lastResult)
      return this.succeed(result)
    } else {
      try {
        const result = await this.action(seed, lastResult)
        return this.succeed(result)
      } catch (e) {
        return this.fail(e)
      }
    }
  }
}
