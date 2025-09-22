import GithubRepoPullRequest from '../types/GithubRepoPullRequest.interface';
import LinkedPR from '../types/LinkedPR.interface';
import { getGithubRepoPullRequests } from './github';
import { getJiraIssue } from './jira';

const JIRA_ISSUE_PREFIX = 'BAJ-';

export function getPullRequestTitlePrefix(pr: GithubRepoPullRequest): string | null {
  const prTitlePrefix = pr.head.ref.split('/')[1]?.replace(/[:.,!?]/, '');
  if (prTitlePrefix?.startsWith(JIRA_ISSUE_PREFIX)) {
    return prTitlePrefix;
  }
  return null;
}

export async function getGithubLinkedPRs(fullRepoName: string): Promise<LinkedPR[]> {
  const prs = await getGithubRepoPullRequests(fullRepoName);

  if (prs.length === 0) {
    return [];
  }

  const linkedPrs = new Array<LinkedPR>();

  await Promise.all(
    prs.map(async (pr) => {
      const prTitlePrefix = getPullRequestTitlePrefix(pr);
      if (!prTitlePrefix) {
        return;
      }

      try {
        const jiraIssue = await getJiraIssue(prTitlePrefix);

        linkedPrs.push({ pr, jiraIssue });
      } catch (error) {
        console.error(`Error fetching Jira issue for PR ${prTitlePrefix}: ${error}`);
      }
    }),
  );

  if (linkedPrs.length === 0) {
    return [];
  }

  return linkedPrs;
}
