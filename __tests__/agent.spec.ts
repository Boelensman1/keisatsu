import Agent from '../src/Agent';
import Task from '../src/Task';

describe('The agent class', () => {
  it('has a name', () => {
    class TestAgent extends Agent {
    }
    const agent = new TestAgent()
    expect(agent).toBeTruthy()
  })

  it('Runs a task', async () => {
    class TestAgent extends Agent {
    }
    class TestTask extends Task {
      public action() {
        this.succeed('test')
      }
    }

    const agent = new TestAgent()
    agent.registerTask(TestTask)

    const result = await agent.runTask('TestTask')
    expect(result.success).toBe(true)
    expect(result.data).toBe('test')
  })

  it('Runs the same task twice, sequentially', async () => {
    class TestAgent extends Agent {
    }
    class TestTask extends Task {
      public action() {
        this.succeed('test')
      }
    }

    const agent = new TestAgent()
    agent.registerTask(TestTask)

    const result = await agent.runTasks(['TestTask', 'TestTask'])

    expect(result[0].success).toBe(true)
    expect(result[0].data).toBe('test')
    expect(result[1].success).toBe(true)
    expect(result[1].data).toBe('test')
  })

  it('Process a difficult taskPlan', async () => {
    class TestAgent extends Agent {
    }
    class TestTask extends Task {
      public action() {
        this.succeed('test')
      }
    }

    class TestTask2 extends Task {
      public action() {
        this.succeed('test2')
      }
    }

    const agent = new TestAgent()
    agent.registerTask(TestTask)
    agent.registerTask(TestTask2)

    const result = await agent.runTasks([
      'TestTask',
      'TestTask2',
      [
        'TestTask',
        'TestTask2',
        'TestTask'
      ]
    ])
    expect(result).toEqual(
      [ { success: true, data: 'test' },
        { success: true, data: 'test2' },
        [ { success: true, data: 'test' },
          { success: true, data: 'test2' },
          { success: true, data: 'test' } ] ])
  })

  it('Passes info to the next task', async () => {
    class TestAgent extends Agent {}
    class Test1 extends Task {
      public action(seed: number, prevData:number) {
        const s = seed || 1
        let d = prevData || 0
        if (Array.isArray(prevData)) {
          d = 9
        }
        this.succeed(s + d)
      }
    }

    const agent = new TestAgent()
    agent.registerTask(Test1)

    const result = await agent.runTasks([
      { name: 'Test1', seed: 0 },
      'Test1',
      [
        'Test1',
        'Test1',
        'Test1'
      ],
      'Test1'
    ])
    expect(result).toEqual(
      [ { success: true, data: 1 },
        { success: true, data: 2 },
        [ { success: true, data: 3 },
          { success: true, data: 3 },
          { success: true, data: 3 } ],
        { success: true, data: 10 }])
  })

  it('saves a taskPlan', async () => {
    class TestAgent extends Agent {
    }
    class TestTask extends Task {
      public action() {
        this.succeed('test')
      }
    }

    const agent = new TestAgent()
    agent.registerTask(TestTask)

    agent.addTaskPlan('main', [
      'TestTask',
      'TestTask',
      [
        'TestTask',
        'TestTask',
        'TestTask'
      ]
    ])

    const result = await agent.runTaskPlan('main')

    expect(result).toEqual(
      [ { success: true, data: 'test' },
        { success: true, data: 'test' },
        [ { success: true, data: 'test' },
          { success: true, data: 'test' },
          { success: true, data: 'test' } ] ])
  })
})
