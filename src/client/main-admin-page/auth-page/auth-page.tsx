import { Box, Heading, Button, SectionMessage, EmptyState } from '@forge/react';
import useGithub from '../../../../ui/hooks/useGithub.hook';
import useAdvancedProductContext from '../../../../ui/hooks/useAdvancedProductContext.hook';
import AuthForm from './auth-form';
import { useNavigate } from 'react-router';

export default function AuthPage() {
  const { isAccountIdLoaded, accountId } = useAdvancedProductContext();
  const { githubToken, githubTokenErrorMessage, isGithubTokenLoading } = useGithub();
  const navigate = useNavigate();

  if (!isAccountIdLoaded || isGithubTokenLoading) {
    return <Box>Loading...</Box>;
  }

  return (
    <Box>
      <Heading>Auth Page</Heading>

      {githubTokenErrorMessage && (
        <Box paddingBlock="space.100">
          <SectionMessage appearance="error">{githubTokenErrorMessage}</SectionMessage>
        </Box>
      )}

      {githubToken ? (
        <Box paddingBlock="space.100">
          <EmptyState
            header={`You are already authenticated with the following token: ${githubToken}. Please continue to the repos page.`}
            primaryAction={
              <Button appearance="subtle" spacing="none" onClick={() => navigate('/repos')}>
                Open Repos Page
              </Button>
            }
          />
        </Box>
      ) : (
        <AuthForm accountId={accountId!} />
      )}
    </Box>
  );
}
