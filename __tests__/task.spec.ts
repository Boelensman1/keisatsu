import Task from '../src/Task';

describe('The task class', () => {
  it('runs the succeed function on completion', async () => {
    class TestTask extends Task {
      public action() {
        this.succeed('test')
      }
    }

    const task = new TestTask()
    const result = await task.run()
    expect(result.success).toBe(true)
    expect(result.data).toBe('test')
  })

  it('runs the fail function when failing', async () => {
    class TestTask extends Task {
      public action() {
        this.fail(new Error('test'))
      }
    }

    const task = new TestTask()
    const result = await task.run()
    expect(result.success).toBe(false)
    expect(result.data).toBe(null)
    expect(result.error.message).toBe('test')
  })
})
