import { Box, Text } from '@forge/react';
import GithubRepo from '../../../../ui/types/GithubRepo.interface';

interface RepoCardProps {
  repo: GithubRepo;
}

function RepoCard(props: RepoCardProps) {
  const { repo } = props;
  return (
    <Box key={repo.id}>
      <Text>{repo.name}</Text>
    </Box>
  );
}

export default RepoCard;
