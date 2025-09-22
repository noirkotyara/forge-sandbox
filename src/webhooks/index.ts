import { WebhookHandlerResponse } from '../types/Webhook.interface';
import { WebhookEvent, WebhookGithubHeaders } from '../types/Webhook.interface';
import { authWebhook } from './github-auth-webhook';
import { githubPRWebhookHandler } from './github-pr-webhook-handler';

const GITHUB_USER_AGENT_PREFIX = 'GitHub-Hookshot';

export async function webhookHandler(event: WebhookEvent): Promise<WebhookHandlerResponse> {
  try {
    const userAgentHeader = event?.headers['user-agent'];
    const isGithubEvent =
      userAgentHeader && userAgentHeader[0]?.startsWith(GITHUB_USER_AGENT_PREFIX);

    const githubEventHeader = event?.headers['x-github-event'];
    const isPullRequestEvent = githubEventHeader && githubEventHeader[0] === 'pull_request';

    if (isGithubEvent && isPullRequestEvent) {
      return authWebhook(event as WebhookEvent<WebhookGithubHeaders>, () =>
        githubPRWebhookHandler(event as WebhookEvent<WebhookGithubHeaders>),
      );
    }

    return {
      statusCode: 200,
      statusText: 'OK',
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      statusText: 'Internal Server Error',
    };
  }
}
