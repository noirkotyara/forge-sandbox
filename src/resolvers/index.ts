import Resolver, { Request } from '@forge/resolver';
import {
  deleteSecret,
  getSecret,
  setSecret,
  getGithubRepos,
  getGithubLinkedPRs,
} from '../services';

const resolver = new Resolver();

resolver.define('setSecret', async (req: Request<{ key: string; value: string }>) => {
  const { key, value } = req.payload;
  return setSecret(key, value);
});

resolver.define('getSecret', async (req: Request<{ key: string }>) => {
  return getSecret(req.payload.key);
});

resolver.define('deleteSecret', async (req: Request<{ key: string }>) => {
  return deleteSecret(req.payload.key);
});

resolver.define('getGithubRepos', async (req: Request<{ githubToken: string }>) => {
  return getGithubRepos(req.payload.githubToken);
});

resolver.define('getGithubLinkedPRs', async (req: Request<{ fullRepoName: string }>) => {
  return getGithubLinkedPRs(req.payload.fullRepoName);
});

export const handler = resolver.getDefinitions();
