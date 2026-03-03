import { NextResponse } from 'next/server';
import { ResponseData } from '../../response';
import { Response } from '../../response';
export class OutputAction {
  public handle(data: ResponseData): NextResponse {
    return Response.send(data);
  }
}
