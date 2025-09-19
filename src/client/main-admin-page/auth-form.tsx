import {
  Button,
  Form,
  FormFooter,
  FormHeader,
  FormSection,
  HelperMessage,
  Label,
  Link,
  SectionMessage,
  Textfield,
  useForm,
} from '@forge/react';
import { useState } from 'react';
import { validateGithubToken } from '../../utils/github';
import { generateUserGithubTokenKey } from '../../services/secret-storage';
import { setSecret } from '../../../ui/services';
import { useNavigate } from 'react-router';

interface AuthFormProps {
  accountId: string;
}

const GITHUB_TOKEN_FORM_KEY = 'github-token';
const GITHUB_MANAGE_ACCESS_TOKENS_LINK =
  'https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens';

function AuthForm(props: AuthFormProps) {
  const { accountId } = props;
  const [authErrorMessage, setAuthError] = useState<string | null>(null);
  const { handleSubmit, register, getFieldId, formState } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (data: Record<string, string>) => {
    try {
      const token = validateGithubToken(data[GITHUB_TOKEN_FORM_KEY]);
      const tokenKey = generateUserGithubTokenKey(accountId!);
      await setSecret(tokenKey, String(token));

      navigate('/repos');
    } catch (error) {
      console.error('[fs]:onSubmit', error);
      setAuthError('Unable to save GitHub token');
    }
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <FormHeader>Insert your GitHub token below before you can continue</FormHeader>
      <FormSection>
        {authErrorMessage && <SectionMessage appearance="error">{authErrorMessage}</SectionMessage>}

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
  );
}

export default AuthForm;
