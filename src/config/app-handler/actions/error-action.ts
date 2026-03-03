import { NextResponse } from 'next/server';
import { AppError } from '../../app-error';
import { Response } from '../../response';

export class ErrorAction {
  public handle(error: any): NextResponse {
    if (error instanceof AppError) {
      return Response.send({
        status: error.status,
        message: error.message,
        data: error.data,
      });
    } else {
      return Response.send({
        status: 500,
        message: `Unhandled error: ${error.message}`,
        data: JSON.stringify(error),
      });
    }
  }
}
