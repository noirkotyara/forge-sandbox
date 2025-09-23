import { useQuery } from '@tanstack/react-query';

import { Box, Inline } from '@forge/react';
import RepoCard from './repo-card';
import { getGithubRepos } from '../../services';
import GithubRepo from '../../../src/types/GithubRepo.interface';

interface ReposListProps {
  githubToken: string;
}

function ReposList(props: ReposListProps) {
  const { githubToken } = props;
  const { data, isLoading, error, isFetching } = useQuery<GithubRepo[]>({
    queryKey: ['github', 'repos'],
    queryFn: async () => getGithubRepos(githubToken),
    refetchOnMount: true,
    enabled: !!githubToken,
  });

  if (isLoading || isFetching) {
    return <Box>Loading…</Box>;
  }

  if (error) {
    return <Box>Failed to load repos. Your github token is invalid or not valid anymore.</Box>;
  }

  if (!data?.length) {
    return <Box>No repos found</Box>;
  }

  return (
    <Inline space="space.200" shouldWrap>
      {data?.map((repo: GithubRepo) => (
        <RepoCard key={repo.id} repo={repo} githubToken={githubToken} />
      ))}
    </Inline>
  );
}

export default ReposList;
