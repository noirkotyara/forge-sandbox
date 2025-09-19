import { kvs } from '@forge/kvs';

export function generateUserGithubTokenKey(accountId: string) {
  return `gh:token:${accountId}`;
}

export async function setSecret(key: string, value: string) {
  await kvs.setSecret(key, value);
}

export async function getSecret(key: string) {
  return kvs.getSecret<string>(key);
}

export async function deleteSecret(key: string) {
  await kvs.deleteSecret(key);
}
