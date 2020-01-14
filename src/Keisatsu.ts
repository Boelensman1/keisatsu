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
    const agent = this.agents[name]
    if (!agent) {
      throw Error(`No agent with name "${name}" is registered`)
    }
    return agent
  }

  public get(property: string): any {
    if (!this.hasOwnProperty(property)) {
      throw Error(`No property with name "${name}" is set`)
    }
    return this[property]
  }

  public has(property: string): boolean {
    return this.hasOwnProperty(property)
  }

  public set(property: string, value: any): void {
    this[property] = value
  }
}
