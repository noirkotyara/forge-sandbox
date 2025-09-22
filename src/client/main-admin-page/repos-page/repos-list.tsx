import { useQuery } from '@tanstack/react-query';

import { Box } from '@forge/react';
import RepoCard from './repo-card';
import { getGithubRepos } from '../../../../ui/services';

interface ReposListProps {
  githubToken: string;
}

function ReposList(props: ReposListProps) {
  const { githubToken } = props;
  const { data, isLoading, error, isFetching } = useQuery({
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

  return (
    <Box>
      {data?.length === 0 ? (
        <Box>No repos found</Box>
      ) : (
        data?.map((repo) => <RepoCard key={repo.id} repo={repo} />)
      )}
    </Box>
  );
}

export default ReposList;
