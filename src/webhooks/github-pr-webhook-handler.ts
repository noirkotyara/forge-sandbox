import { getPullRequestTitlePrefix } from '../services/github-linked-prs';
import { markJiraIssueAsDone } from '../services/jira';
import { WebhookEvent, WebhookGithubHeaders } from '../types/Webhook.interface';
import { WebhookHandlerResponse } from '../types/Webhook.interface';

/**
 * @see {@link https://docs.github.com/en/webhooks/webhook-events-and-payloads?actionType=closed#pull_request}
 */
export async function githubPRWebhookHandler(
  event: WebhookEvent<WebhookGithubHeaders>,
): Promise<WebhookHandlerResponse> {
  const eventBody = JSON.parse(event.body);

  const isMerged = eventBody.action === 'closed' && eventBody.pull_request.merged;
  const jiraIssueKey = getPullRequestTitlePrefix(eventBody.pull_request);

  if (isMerged && jiraIssueKey) {
    await markJiraIssueAsDone(jiraIssueKey);
  }

  return {
    statusCode: 200,
    statusText: 'OK',
  };
}
