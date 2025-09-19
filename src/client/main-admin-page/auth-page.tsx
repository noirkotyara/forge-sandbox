import {
  Box,
  Form,
  Heading,
  FormHeader,
  FormSection,
  Textfield,
  HelperMessage,
  Label,
  useForm,
  FormFooter,
  Button,
  Link,
  SectionMessage,
  EmptyState,
} from '@forge/react';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { generateUserGithubTokenKey } from '../../services/secret-storage';
import { setSecret } from '../../../ui/services';
import useGithub from '../../../ui/hooks/useGithub.hook';
import useAdvancedProductContext from '../../../ui/hooks/useAdvancedProductContext.hook';
import { validateGithubToken } from '../../utils/github';

const GITHUB_TOKEN_FORM_KEY = 'github-token';
const GITHUB_MANAGE_ACCESS_TOKENS_LINK =
  'https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens';

export default function AuthPage() {
  const { isAccountIdLoaded, accountId } = useAdvancedProductContext();
  const { handleSubmit, register, getFieldId, formState } = useForm();
  const navigate = useNavigate();
  const { githubToken, githubTokenErrorMessage } = useGithub();
  const [authErrorMessage, setAuthError] = useState<string | null>(null);

  const onSubmit = async (data: Record<string, string>) => {
    if (!isAccountIdLoaded) {
      throw new Error('Account ID is not loaded yet, try again later');
    }

    try {
      const token = validateGithubToken(data[GITHUB_TOKEN_FORM_KEY]);
      const tokenKey = generateUserGithubTokenKey(accountId!);
      await setSecret(tokenKey, String(token));

      navigate('/repos');
    } catch (error) {
      console.error('[fs] onSubmit Error', error);
      setAuthError('Unable to save GitHub token');
    }
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
      <Heading>Auth Page</Heading>

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
        <Form onSubmit={handleSubmit(onSubmit)}>
          <FormHeader>Insert your GitHub token below before you can continue</FormHeader>
          <FormSection>
            {authErrorMessage && (
              <SectionMessage appearance="error">{authErrorMessage}</SectionMessage>
            )}

            <Label labelFor={getFieldId(GITHUB_TOKEN_FORM_KEY)}>Github Token</Label>
            <Textfield {...register(GITHUB_TOKEN_FORM_KEY, { required: true })} />
            <HelperMessage>
              Here is a guide on how to get your GitHub token:&nbsp;
              <Link href={GITHUB_MANAGE_ACCESS_TOKENS_LINK}>link</Link>
            </HelperMessage>
          </FormSection>

          <FormFooter>
            <Button
              appearance="primary"
              type="submit"
              isDisabled={formState.isSubmitting || formState.isSubmitSuccessful}
            >
              Submit
            </Button>
          </FormFooter>
        </Form>
      )}
    </Box>
  );
}
