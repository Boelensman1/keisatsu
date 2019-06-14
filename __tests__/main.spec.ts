import Keisatsu from '../src/Keisatsu';

describe('greeter function', () => {
  // Assert if setTimeout was called properly
  it('does nothing', () => {
    const keisatsu = new Keisatsu()
    expect(keisatsu).toBeTruthy()
  });
});
