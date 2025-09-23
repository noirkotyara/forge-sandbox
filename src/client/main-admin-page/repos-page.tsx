import { Fragment } from 'react';
import { Box, Button, EmptyState, Heading, SectionMessage } from '@forge/react';
import { useNavigate } from 'react-router';
import useGithub from '../../../ui/hooks/useGithub.hook';
import { deleteSecret } from '../../../ui/services';
import { generateUserGithubTokenKey } from '../../services/secret-storage';
import useAdvancedProductContext from '../../../ui/hooks/useAdvancedProductContext.hook';
import ReposList from '../../../ui/components/repos/repos-list';

export default function ReposPage() {
  const { isAccountIdLoaded, accountId } = useAdvancedProductContext();
  const navigate = useNavigate();
  const { githubToken, githubTokenErrorMessage, isGithubTokenLoading } = useGithub();

  const onDeleteGithubToken = async () => {
    if (!isAccountIdLoaded) {
      throw new Error('Account ID is not loaded yet, try again later');
    }
    await deleteSecret(generateUserGithubTokenKey(accountId!));
    navigate('/auth');
  };

  if (!isAccountIdLoaded || isGithubTokenLoading) {
    return <Box>Loading...</Box>;
  }

  return (
    <Box>
      <Heading>Repos Page</Heading>
      <Box paddingBlock="space.100">
        {githubTokenErrorMessage && (
          <SectionMessage appearance="error">{githubTokenErrorMessage}</SectionMessage>
        )}

        {githubToken ? (
          <Fragment>
            <Button onClick={onDeleteGithubToken}>Delete GitHub Token</Button>
            <Box paddingBlock="space.100">
              <ReposList githubToken={githubToken} />
            </Box>
          </Fragment>
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
