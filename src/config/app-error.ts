export class AppError<T> extends Error {
  public status: number;
  public data: T;

  constructor(message: string, data: T, status?: number) {
    super(message);
    this.data = data;
    this.status = status ?? 500;
  }
}
