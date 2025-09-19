export function validateGithubToken(token: unknown): string {
  // TODO: Implement github token validation
  if (typeof token !== 'string') {
    throw new Error('Provided github token is not valid');
  }

  return token;
}
