import { invoke } from '@forge/bridge';
import GithubRepo from '../../src/types/GithubRepo.interface';

export async function setSecret(key: string, value: string) {
  return invoke('setSecret', {
    key,
    value,
  });
}

export async function getSecret(key: string) {
  return invoke('getSecret', { key });
}

export async function deleteSecret(key: string) {
  return invoke('deleteSecret', { key });
}

export async function getGithubRepos(githubToken: string): Promise<GithubRepo[]> {
  return invoke('getGithubRepos', { githubToken });
}
