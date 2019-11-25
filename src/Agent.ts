import Task, { RunResult } from './Task'
import Keisatsu, { Options } from './Keisatsu'

interface Tasks {
  [taskName: string]: Task
}

interface TaskObj {
  name: string
  seed?: any
}

type taskPlanElement = TaskObj | string
type NestedtaskPlan = taskPlanElement | taskPlanElement[]
type taskPlan = taskPlanElement[] | NestedtaskPlan[]

interface taskPlans {
  [taskPlanName: string]: taskPlan
}

function getLastResult(results: any[]) {
  if (results.length === 0) {
    return undefined
  }
  const result = results[results.length - 1]
  if (!Array.isArray(result)) {
    return result.data
  }
  return result.map((r: RunResult) => r.data)
}

export default abstract class Agent {
  private tasks: Tasks = {}
  private taskPlans: taskPlans = {}

  constructor(private hq: Keisatsu, private options: Options) {}

  public get(property: string): any {
    if (!this.hasOwnProperty(property)) {
      throw Error(`No property with name "${name}" is set`)
    }
    return this[property]
  }

  public set(property: string, value: any): void {
    this[property] = value
  }

  public registerTask<T extends Task>(task: { new (...args: any[]): T }): void {
    this.tasks[task.name] = new task(this.hq, this)
  }

  public addTaskPlan(name: string, taskPlan: taskPlan): void {
    this.taskPlans[name] = taskPlan
  }

  public runTaskPlan(name: string): Promise<RunResult> {
    const taskPlan = this.taskPlans[name]
    if (!taskPlan) {
      throw Error(`No taskPlan with name "${name}" is registered`)
    }
    return this.runTasks(taskPlan)
  }

  public runTask(task: taskPlanElement, lastResult?: any): Promise<RunResult> {
    if (typeof task === 'string' || task instanceof String) {
      const taskToRun = this.tasks[task as string]
      if (!taskToRun) {
        throw Error(`No task with name "${task}" is registered`)
      }
      return taskToRun.run(undefined, lastResult, this.options)
    }
    return this.tasks[task.name].run(task.seed, lastResult, this.options)
  }

  public async runTasks(taskPlan: taskPlan): Promise<any> {
    const results = []

    for (let tasks of taskPlan) {
      const lastResult = getLastResult(results)
      if (Array.isArray(tasks)) {
        results.push(
          await Promise.all(
            tasks.map((task: taskPlanElement) =>
              this.runTask(task, lastResult),
            ),
          ),
        )
      } else {
        const result = await this.runTask(tasks, lastResult)
        results.push(result)
      }
    }

    return results
  }
}
