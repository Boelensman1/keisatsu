import Keisatsu from '../src/Keisatsu'
import Agent from '../src/Agent'
import Task from '../src/Task'

const createTestKeitatsuAgent = (): { keisatsu: Keisatsu; agent: Agent } => {
  class TestKeisatsu extends Keisatsu {}
  class TestAgent extends Agent {}

  const keisatsu = new TestKeisatsu()
  return { keisatsu, agent: new TestAgent(keisatsu) }
}

describe('The task class', () => {
  it('runs the succeed function on completion', async () => {
    class TestTask extends Task {
      public action() {
        return 'test'
      }
    }

    const { keisatsu, agent } = createTestKeitatsuAgent()
    const task = new TestTask(keisatsu, agent)
    const result = await task.run()
    expect(result.success).toBe(true)
    expect(result.data).toBe('test')
  })

  it('runs the fail function when failing', async () => {
    class TestTask extends Task {
      public action() {
        throw new Error('test')
      }
    }

    const { keisatsu, agent } = createTestKeitatsuAgent()
    const task = new TestTask(keisatsu, agent)

    const result = await task.run()
    expect(result.success).toBe(false)
    expect(result.data).toBe(null)
    expect(result.error.message).toBe('test')
  })
})
