export class CustomError {
  constructor(
    public message: string | string[],
    public code: number,
    public name = "CustomError"
  ) {
    this.message = message;
    this.code = code;
    this.name = name;
  }
}

export class FunctionError extends CustomError {
  constructor(message: string, public code: number) {
    super(message, code, "FunctionError");
    this.name = "FunctionError";
  }
}
