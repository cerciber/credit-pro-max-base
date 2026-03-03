import { ResponseData } from '../response';
import { UserPayload } from '../../modules/users/schemas/user-schema';
import { AuthAction } from './actions/auth-action';
import { InputAction } from './actions/input-action';
import { OutputAction } from './actions/output-action';
import { ErrorAction } from './actions/error-action';
import { z } from 'zod';
import { NextRequest, NextResponse } from 'next/server';

export interface CustomNextRequest {
  url: string;
  method: string;
  headers: Record<string, string>;
  query: any;
  body: any;
  user: UserPayload;
}

export interface HandlerConfig {
  inputSchema: z.ZodSchema;
  outputSchema: z.ZodSchema;
  roles?: string[];
}

type HandlerFunction = (req: CustomNextRequest) => Promise<ResponseData>;

type Handler = (req: NextRequest) => Promise<NextResponse>;

export class AppHandler {
  private config: HandlerConfig;
  private handlerFunction: HandlerFunction;

  constructor(config: HandlerConfig, handlerFunction: HandlerFunction) {
    this.config = config;
    this.handlerFunction = handlerFunction;
  }

  public async execute(req: NextRequest): Promise<NextResponse> {
    try {
      const customReq = await new InputAction().validate(req, this.config);
      new AuthAction().validate(customReq, this.config.roles);

      const response = await this.handlerFunction(customReq);

      return new OutputAction().handle(response);
    } catch (error) {
      return new ErrorAction().handle(error);
    }
  }

  public static create(
    config: HandlerConfig,
    handlerFunction: HandlerFunction
  ): Handler {
    const appHandler = new AppHandler(config, handlerFunction);
    return (req: NextRequest) => appHandler.execute(req);
  }
}
