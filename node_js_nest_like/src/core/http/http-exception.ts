export class HttpException extends Error {
  readonly errorData: any = undefined;
  readonly errorMessage: string;
  readonly statusCode: number;

  constructor(errorMessage: string, statusCode: number, errorData?: any) {
    super();
    this.statusCode = statusCode;
    this.errorMessage = errorMessage;
    this.errorData = errorData;
  }
}
