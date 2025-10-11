interface AppErrorProps {
  message: string;
  statusCode: number;
}

export class AppError extends Error {
  public readonly statusCode: number;

  constructor({ message, statusCode }: AppErrorProps) {
    super(message);
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, AppError.prototype);
  }
}
