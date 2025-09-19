import { invoke } from '@forge/bridge';

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
