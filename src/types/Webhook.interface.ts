export interface WebhookEvent<HeadersType = WebhookHeaders> {
  method: string;
  headers: HeadersType;
  body: string;
  path: string;
  queryParameters: Record<string, unknown>;
}

interface WebhookHeaders {
  Accept: string[];
  'accept-encoding': string[];
  'user-agent': string[];
  'content-length': string[];
  connection: string[];
  host: string[];
  'cache-control': string[];
  'content-type': string[];
  [key: string]: string[];
}

export interface WebhookGithubHeaders extends WebhookHeaders {
  'x-github-delivery': string[];
  'x-hub-signature': string[];
  'x-hub-signature-256': string[];
  'x-github-event': string[];
  'x-github-hook-id': string[];
  'x-github-hook-installation-target-id': string[];
  'x-github-hook-installation-target-type': string[];
}

export interface WebhookHandlerResponse {
  statusCode: number;
  statusText: string;
}
