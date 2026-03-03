import { CustomNextRequest } from '../app-handler';
import { HandlerConfig } from '../app-handler';
import { z } from 'zod';
import { AppError } from '../../app-error';
import { NextRequest } from 'next/server';
import { validate } from '@/src/lib/validate';

export class InputAction {
  private async getBody(req: NextRequest): Promise<any> {
    if (req.method === 'GET' || req.method === 'DELETE') {
      return undefined;
    }

    const contentLength = req.headers.get('content-length');
    const contentType = req.headers.get('content-type');

    if (
      !contentLength ||
      contentLength === '0' ||
      !contentType?.includes('application/json')
    ) {
      return {};
    }

    return await req.json();
  }

  private async getRequestData(req: NextRequest): Promise<CustomNextRequest> {
    return {
      url: req.nextUrl.pathname,
      method: req.method,
      headers: Object.fromEntries(req.headers.entries()),
      query: Object.fromEntries(req.nextUrl.searchParams.entries()),
      body: await this.getBody(req),
      user: {
        id: '',
        username: '',
        email: '',
        role: 'client',
        name: '',
        genre: 'M',
        iat: 0,
        exp: 0,
      },
    };
  }

  private validateInput(
    req: CustomNextRequest,
    schema: z.ZodSchema
  ): { success: boolean; errors: string[] } {
    validate<CustomNextRequest>(
      req,
      schema,
      `Invalid input data for ${req.url}`
    );
    return { success: true, errors: [] };
  }

  public async validate(
    req: NextRequest,
    config: HandlerConfig
  ): Promise<CustomNextRequest> {
    const customReq = await this.getRequestData(req);
    const { success, errors } = this.validateInput(
      customReq,
      config.inputSchema
    );

    if (!success) {
      throw new AppError<string[]>('Invalid input data', errors, 400);
    }

    return customReq;
  }
}
