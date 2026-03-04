import axios, { AxiosRequestConfig, Method } from 'axios';
import fs from 'fs';
import https from 'https';
import tls from 'tls';
import { z } from 'zod';
import { validate } from './validate';
import {
  MulesoftUri,
  mulesoftUriSchema,
} from '../modules/general/schemas/mulesoft-uri-schema';

const baseURL = validate<MulesoftUri>(
  process.env.MULESOFTURI,
  mulesoftUriSchema,
  'Invalid MULESOFTURI environment variable'
);

const normalizePem = (value: string): string => {
  const trimmed = value.trim().replace(/^['"]|['"]$/g, '');
  return trimmed.replace(/\\n/g, '\n');
};

const convertToStringBinary = (value: string): string => {
  return Buffer.from(value, 'base64').toString('binary');
};

const parsePemValue = (envName: string, rawValue: string): string => {
  const normalized = normalizePem(rawValue);
  if (normalized.includes('-----BEGIN')) {
    return normalized;
  }

  if (fs.existsSync(normalized)) {
    return fs.readFileSync(normalized, 'utf8');
  }

  try {
    const decodedBinary = convertToStringBinary(normalized);
    if (decodedBinary) {
      return decodedBinary;
    }
  } catch {
    // ignore base64 decode errors and throw a friendly message below
  }

  throw new Error(
    `Invalid ${envName}: expected PEM content, PEM file path, or base64 PEM`
  );
};

const certificateSchema = z.string().min(1);
const certificate = parsePemValue(
  'CERTIFICATE',
  validate<string>(
    process.env.CERTIFICATE,
    certificateSchema,
    'Invalid CERTIFICATE environment variable'
  )
);
const certificateCa = parsePemValue(
  'CERTIFICATECA',
  validate<string>(
    process.env.CERTIFICATECA,
    certificateSchema,
    'Invalid CERTIFICATECA environment variable'
  )
);
const certificateKey = parsePemValue(
  'CERTIFICATEKEY',
  validate<string>(
    process.env.CERTIFICATEKEY,
    certificateSchema,
    'Invalid CERTIFICATEKEY environment variable'
  )
);

const httpsAgent = new https.Agent({
  rejectUnauthorized: false,
  cert: certificate,
  // Mantiene CAs del sistema y agrega la CA custom
  ca: [certificateCa, ...tls.rootCertificates],
  key: certificateKey,
});

const instance = axios.create({
  baseURL,
  httpsAgent,
  headers: {
    'x-digital-token': '1',
  },
});

type StatusCode = number;

type MulesoftError =
  | {
      type: 'INPUT_SCHEMA_VALIDATION';
      message: string;
      details: z.ZodIssue[];
    }
  | {
      type: 'OUTPUT_SCHEMA_VALIDATION';
      message: string;
      details: z.ZodIssue[];
      rawResponse: unknown;
    }
  | {
      type: 'HTTP_STATUS';
      message: string;
      response: unknown;
    }
  | {
      type: 'NETWORK';
      message: string;
    };

type MulesoftSuccess<Output> = {
  ok: true;
  status: StatusCode;
  data: Output;
  error: null;
};

type MulesoftFailure = {
  ok: false;
  status: StatusCode;
  data: null;
  error: MulesoftError;
};

export type MulesoftResult<Output> = MulesoftSuccess<Output> | MulesoftFailure;

type MulesoftRequestOptions<Input, Output> = {
  method: Method;
  url: string;
  input: Input;
  inputSchema: z.ZodSchema<Input>;
  outputSchema: z.ZodSchema<Output>;
  expectedSuccessStatus: StatusCode | StatusCode[];
  config?: AxiosRequestConfig;
  sendAs?: 'params' | 'data';
};

const toArray = (status: StatusCode | StatusCode[]): StatusCode[] => {
  return Array.isArray(status) ? status : [status];
};

const request = async <Input, Output>(
  options: MulesoftRequestOptions<Input, Output>
): Promise<MulesoftResult<Output>> => {
  const {
    method,
    url,
    input,
    inputSchema,
    outputSchema,
    expectedSuccessStatus,
    config,
    sendAs = 'data',
  } = options;

  const parsedInput = inputSchema.safeParse(input);
  if (!parsedInput.success) {
    return {
      ok: false,
      status: 400,
      data: null,
      error: {
        type: 'INPUT_SCHEMA_VALIDATION',
        message: 'Invalid input for Mulesoft request',
        details: parsedInput.error.issues,
      },
    };
  }

  const expectedStatuses = toArray(expectedSuccessStatus);

  try {
    const axiosConfig: AxiosRequestConfig = {
      method,
      url,
      validateStatus: () => true,
      ...config,
    };

    if (sendAs === 'params') {
      axiosConfig.params = parsedInput.data;
    } else {
      axiosConfig.data = parsedInput.data;
    }

    const response = await instance.request(axiosConfig);
    const responseBody = response.data?.body ?? response.data;

    if (!expectedStatuses.includes(response.status)) {
      return {
        ok: false,
        status: response.status,
        data: null,
        error: {
          type: 'HTTP_STATUS',
          message: `Unexpected status code from Mulesoft: ${response.status}`,
          response: responseBody,
        },
      };
    }

    const parsedOutput = outputSchema.safeParse(responseBody);
    if (!parsedOutput.success) {
      return {
        ok: false,
        status: response.status,
        data: null,
        error: {
          type: 'OUTPUT_SCHEMA_VALIDATION',
          message: 'Invalid output from Mulesoft response',
          details: parsedOutput.error.issues,
          rawResponse: responseBody,
        },
      };
    }

    return {
      ok: true,
      status: response.status,
      data: parsedOutput.data,
      error: null,
    };
  } catch (error: any) {
    return {
      ok: false,
      status: error?.response?.status ?? null,
      data: null,
      error: {
        type: 'NETWORK',
        message: `Error calling Mulesoft API: ${error?.message || 'Unknown error'}`,
      },
    };
  }
};

const get = async <Input, Output>(
  url: string,
  options: Omit<
    MulesoftRequestOptions<Input, Output>,
    'method' | 'url' | 'sendAs'
  >
): Promise<MulesoftResult<Output>> => {
  return request<Input, Output>({
    ...options,
    method: 'GET',
    url,
    sendAs: 'params',
  });
};

const post = async <Input, Output>(
  url: string,
  options: Omit<
    MulesoftRequestOptions<Input, Output>,
    'method' | 'url' | 'sendAs'
  >
): Promise<MulesoftResult<Output>> => {
  return request<Input, Output>({
    ...options,
    method: 'POST',
    url,
    sendAs: 'data',
  });
};

const put = async <Input, Output>(
  url: string,
  options: Omit<
    MulesoftRequestOptions<Input, Output>,
    'method' | 'url' | 'sendAs'
  >
): Promise<MulesoftResult<Output>> => {
  return request<Input, Output>({
    ...options,
    method: 'PUT',
    url,
    sendAs: 'data',
  });
};

const del = async <Input, Output>(
  url: string,
  options: Omit<
    MulesoftRequestOptions<Input, Output>,
    'method' | 'url' | 'sendAs'
  >
): Promise<MulesoftResult<Output>> => {
  return request<Input, Output>({
    ...options,
    method: 'DELETE',
    url,
    sendAs: 'params',
  });
};

export const mulesoftApi = {
  request,
  get,
  post,
  put,
  delete: del,
};
