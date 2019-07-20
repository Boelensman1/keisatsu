import Agent from './Agent'

interface Agents {
  [agentName: string]: Agent
}

export default abstract class Keisatsu {
  private agents: Agents = {}
  constructor() {}

  public registerAgent<T extends Agent>(agent: { new (...args: any[]): T }): T {
    const newAgent = new agent(this)
    this.agents[agent.name] = newAgent
    return newAgent
  }

  public getAgent(name: string): Agent {
    return this.agents[name]
  }

  public get(property: string): any {
    return this[property]
  }
}
