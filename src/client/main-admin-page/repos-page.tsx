import { Box, Button, EmptyState, Heading, SectionMessage } from '@forge/react';
import { useNavigate } from 'react-router';
import useGithub from '../../../ui/hooks/useGithub.hook';
import { deleteSecret } from '../../../ui/services';
import { generateUserGithubTokenKey } from '../../services/secret-storage';
import useAdvancedProductContext from '../../../ui/hooks/useAdvancedProductContext.hook';

export default function ReposPage() {
  const { isAccountIdLoaded, accountId } = useAdvancedProductContext();
  const navigate = useNavigate();
  const { githubToken, githubTokenErrorMessage } = useGithub();

  const onDeleteGithubToken = async () => {
    if (!isAccountIdLoaded) {
      throw new Error('Account ID is not loaded yet, try again later');
    }
    await deleteSecret(generateUserGithubTokenKey(accountId!));
    navigate('/auth');
  };

  if (!isAccountIdLoaded) {
    return <Box>Loading...</Box>;
  }

  if (githubTokenErrorMessage) {
    return (
      <Box paddingBlock="space.100">
        <SectionMessage appearance="error">{githubTokenErrorMessage}</SectionMessage>
      </Box>
    );
  }

  return (
    <Box>
      <Heading>Repos Page</Heading>
      <Box paddingBlock="space.100">
        {githubToken ? (
          <Button onClick={onDeleteGithubToken}>Delete GitHub Token</Button>
        ) : (
          <EmptyState
            header="You are not authenticated, please authenticate with github token to continue on auth page"
            primaryAction={
              <Button
                appearance="subtle"
                spacing="none"
                onClick={() => navigate('/auth')}
                isDisabled={!isAccountIdLoaded}
              >
                Open Auth Page
              </Button>
            }
          />
        )}
      </Box>
    </Box>
  );
}
