import { frame } from '../../src/utils';

jest.useFakeTimers();

describe('utils.js', () => {
  describe('methods', () => {
    describe('frame()', () => {
      it('should wait one frame by default', (done) => {
        frame().then(() => {
          expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 1);
          done();
        });
        jest.runOnlyPendingTimers();
      });
      it('should wait for 1000ms', (done) => {
        frame(1000).then(() => {
          expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 1000);
          done();
        });
        jest.runOnlyPendingTimers();
      });
    });
  });
});
