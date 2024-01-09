export class FunctionError extends Error {
  constructor(message: string, public code: number) {
    super(message);
    this.name = "FunctionError";
    this.code = code;
  }
}
