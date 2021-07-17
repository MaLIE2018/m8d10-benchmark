declare global {
  namespace NodeJS {
    interface Global {
      myConfig: {
        a: number;
        b: number;
      };
    }
  }
}
