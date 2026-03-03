import { NextResponse } from 'next/server';

export interface ResponseData {
  status: number;
  message: string;
  data?: any;
}

export class Response {
  public static send(data: ResponseData): NextResponse {
    return NextResponse.json(data, { status: data.status });
  }
}
