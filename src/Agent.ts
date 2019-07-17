import Task, { RunResult } from './Task'

interface IMTask {
  new (): Task
  setHq?(hq: any): void
}
interface Tasks {
  [taskName: string]: IMTask
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
  private hq: any
  private tasks: Tasks = {}
  private taskPlans: taskPlans = {}

  constructor() {}

  public setHq(hq: any): void {
    this.hq = hq
  }

  public registerTask(task: IMTask): void {
    this.tasks[task.name] = task
  }

  public addTaskPlan(name: string, taskPlan: taskPlan): void {
    this.taskPlans[name] = taskPlan
  }

  public runTaskPlan(name: string): Promise<RunResult> {
    return this.runTasks(this.taskPlans[name])
  }

  public runTask(task: taskPlanElement, lastResult?: any): Promise<RunResult> {
    if (typeof task === 'string' || task instanceof String) {
      return new this.tasks[task as string]().run(
        undefined,
        lastResult,
        this.hq,
      )
    }
    return new this.tasks[task.name]().run(task.seed, lastResult)
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
