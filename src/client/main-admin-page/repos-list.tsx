import { useQuery } from '@tanstack/react-query';
import { getGithubRepos } from '../../services';
import { Box, Text } from '@forge/react';

interface ReposListProps {
  githubToken: string;
}

interface GithubRepo {
  id: number;
  name: string;
  full_name: string;
  private: boolean;
  html_url: string;
  description: string;
  created_at: string;
  updated_at: string;
}

function ReposList(props: ReposListProps) {
  const { githubToken } = props;
  const { data, isLoading, error, isFetching } = useQuery({
    queryKey: ['github', 'repos'],
    queryFn: async () => {
      const res = await getGithubRepos(githubToken);
      return res;
    },
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
        data?.map((repo: GithubRepo) => (
          <Box key={repo.id}>
            <Text>{repo.name}</Text>
          </Box>
        ))
      )}
    </Box>
  );
}

export default ReposList;
