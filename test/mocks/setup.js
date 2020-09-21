// window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  }))
});
// process.env
Object.defineProperty(process, 'env', {
  writable: true,
  value: {
    madocConfig: {
      filePaths: []
    }
  }
});
// console
console.info = jest.fn();
console.warn = jest.fn();
console.error = jest.fn();
console.debug = jest.fn();
