import GithubRepoPullRequest from './GithubRepoPullRequest.interface';
import JiraIssue from './JiraIssue.interface';

interface LinkedPR {
  pr: GithubRepoPullRequest;
  jiraIssue: JiraIssue;
}

export default LinkedPR;
