import Agent from './Agent'

interface Agents {
  [agentName: string]: Agent
}

export default abstract class Keisatsu {
  private agents: Agents = {}
  constructor() {}

  public registerAgent(agent: Agent): void {
    agent.setHq(this)
    this.agents[agent.constructor.name] = agent
  }

  public getAgent(name: string): Agent {
    return this.agents[name]
  }
}
