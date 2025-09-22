import api, { APIResponse, route } from '@forge/api';
import JiraIssue from '../types/JiraIssue.interface';

async function handleGetJiraIssueResponse<T>(result: APIResponse): Promise<T> {
  const response = await result.json();

  if (response.errorMessages?.length > 0) {
    throw new Error(response.errorMessages.join(', '));
  }

  return response;
}

export async function getJiraIssue(issueKey: string): Promise<JiraIssue> {
  const result = await api.asApp().requestJira(route`/rest/api/3/issue/${issueKey}`);

  return handleGetJiraIssueResponse<JiraIssue>(result);
}

const DONE_TRANSITION_ID = '31';

interface Transition {
  id: string;
  isAvailable: boolean;
}

export async function markJiraIssueAsDone(issueKey: string): Promise<void> {
  try {
    const transitionsResult = await api
      .asApp()
      .requestJira(route`/rest/api/3/issue/${issueKey}/transitions`);
    const transitionsResponse = await handleGetJiraIssueResponse<{ transitions: Transition[] }>(
      transitionsResult,
    );

    const isDoneTransitionAvailable = transitionsResponse.transitions.find(
      (transition: Transition) => transition.id === DONE_TRANSITION_ID,
    )?.isAvailable;

    if (!isDoneTransitionAvailable) {
      throw new Error('Done transition is not available');
    }

    const transitionBody = {
      transition: {
        id: DONE_TRANSITION_ID,
      },
    };

    const transitionResult = await api
      .asApp()
      .requestJira(route`/rest/api/3/issue/${issueKey}/transitions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(transitionBody),
      });

    if (!transitionResult.ok) {
      throw new Error('Failed to mark Jira issue as done');
    }
  } catch (error) {
    console.error('[services.markJiraIssueAsDone] Error marking Jira issue as done:', {
      issueKey,
      error,
    });
    throw error;
  }
}
