import Agent from './Agent'

interface Agents {
  [agentName: string]: Agent
}

export interface Options {
  throwErrors?: boolean
}

export default abstract class Keisatsu {
  private agents: Agents = {}
  constructor(private options: Options = { throwErrors: false }) {}

  public registerAgent<T extends Agent>(agent: { new (...args: any[]): T }): T {
    const newAgent = new agent(this, this.options)
    this.agents[agent.name] = newAgent
    return newAgent
  }

  public getAgent(name: string): Agent {
    return this.agents[name]
  }

  public get(property: string): any {
    return this[property]
  }

  public set(property: string, value: any): void {
    this[property] = value
  }
}
