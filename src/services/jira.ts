import api, { route } from '@forge/api';
import JiraIssue from '../types/JiraIssue.interface';

export async function getJiraIssue(issueKey: string): Promise<JiraIssue> {
  const result = await api.asApp().requestJira(route`/rest/api/3/issue/${issueKey}`);
  const response = await result.json();
  console.log('jira-response', JSON.stringify(response, null, 2));

  if (response.errorMessages?.length > 0) {
    throw new Error(response.errorMessages.join(', '));
  }

  return response;
}
