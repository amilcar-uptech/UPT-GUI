import { StaticMethodPipe } from './static-method.pipe';

describe('StaticMethodPipe', () => {
  it('create an instance', () => {
    const pipe = new StaticMethodPipe();
    expect(pipe).toBeTruthy();
  });
});
