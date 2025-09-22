import { Webhooks } from '@octokit/webhooks';
import {
  WebhookEvent,
  WebhookGithubHeaders,
  WebhookHandlerResponse,
} from '../types/Webhook.interface';

export async function authWebhook(
  event: WebhookEvent<WebhookGithubHeaders>,
  callback: () => Promise<WebhookHandlerResponse>,
) {
  const webhooks = new Webhooks({
    secret: process.env.GITHUB_PR_WEBHOOK_SECRET || '',
  });

  const signature = event.headers['x-hub-signature-256'][0];
  if (!signature) {
    return {
      statusCode: 401,
      statusText: 'Unauthorized',
    };
  }

  const isWebhookRequestValid = await webhooks.verify(event.body, signature);
  if (!isWebhookRequestValid) {
    return {
      statusCode: 401,
      statusText: 'Unauthorized',
    };
  }

  return callback();
}
