import { Octokit } from '@octokit/core';
import GithubRepo from '../types/GithubRepo.interface';
import GithubRepoPullRequest from '../types/GithubRepoPullRequest.interface';

export async function getGithubRepos(githubToken: string): Promise<GithubRepo[]> {
  // TODO: move to env
  const url = new URL('https://api.github.com/user/repos');
  url.searchParams.set('type', 'owner');
  url.searchParams.set('per_page', '10');

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${githubToken}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch Github repos');
  }

  return response.json();
}

export async function getGithubRepoPullRequests(
  fullRepoName: string,
): Promise<GithubRepoPullRequest[]> {
  const url = new URL(`https://api.github.com/repos/${fullRepoName}/pulls`);
  url.searchParams.set('state', 'open');
  url.searchParams.set('per_page', '20');

  const response = await fetch(url, {
    method: 'GET',
  });

  if (!response.ok) {
    throw new Error('Failed to fetch Github repo pull requests');
  }

  return response.json();
}

/**
 * @see {@link https://docs.github.com/rest/pulls/pulls#merge-a-pull-request}
 */
export async function mergeGithubRepoPullRequest(
  githubToken: string,
  fullRepoName: string,
  prNumber: number,
): Promise<void> {
  const octokit = new Octokit({
    auth: githubToken,
  });

  const [owner, repo] = fullRepoName.split('/');

  await octokit.request(`PUT /repos/${fullRepoName}/pulls/${prNumber}/merge`, {
    owner,
    repo,
    pull_number: prNumber,
    headers: {
      'X-GitHub-Api-Version': '2022-11-28',
      accept: 'application/vnd.github+json',
    },
  });
}
