export async function getGithubRepos(githubToken: string) {
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
