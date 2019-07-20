import Keisatsu from '../src/Keisatsu'
import Agent from '../src/Agent'
import Task from '../src/Task'

const createTestAgent = (keisatsu: Keisatsu): Agent => {
  class TestAgent extends Agent {}
  class TestTask extends Task {
    public action() {
      return 'test'
    }
  }

  const agent = keisatsu.registerAgent(TestAgent)
  agent.registerTask(TestTask)

  agent.addTaskPlan('main', ['TestTask'])
  return agent
}

describe('The keisatsu class', () => {
  it('Registers an Agent', async () => {
    class TestKeitsatu extends Keisatsu {}

    const testKeitsatu = new TestKeitsatu()
    createTestAgent(testKeitsatu)

    const result = await testKeitsatu.getAgent('TestAgent').runTaskPlan('main')
    expect(result[0].success).toBe(true)
    expect(result[0].data).toBe('test')
  })
  it('Gives Agents access to its data', async () => {
    class TestKeitsatu extends Keisatsu {
      public readonly data: string = 'test2'
    }

    const testKeitsatu = new TestKeitsatu()

    class TestTask2 extends Task {
      public action(_seed: number, _prevData: number) {
        return this.hq.get('data')
      }
    }
    const testAgent = createTestAgent(testKeitsatu)

    testAgent.registerTask(TestTask2)
    testAgent.addTaskPlan('test', ['TestTask2'])

    const result = await testKeitsatu.getAgent('TestAgent').runTaskPlan('test')
    expect(result[0].success).toBe(true)
    expect(result[0].data).toBe('test2')
  })
})
