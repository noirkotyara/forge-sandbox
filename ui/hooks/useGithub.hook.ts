import { generateUserGithubTokenKey } from '../../src/services/secret-storage';
import { getSecret } from '../services';
import useAdvancedProductContext from './useAdvancedProductContext.hook';
import { useQuery } from '@tanstack/react-query';

function useGithub() {
  const { isAccountIdLoaded, accountId } = useAdvancedProductContext();
  const { data, isLoading, error, isFetching } = useQuery({
    queryKey: ['github', 'token'],
    queryFn: async () => {
      const tokenKey = generateUserGithubTokenKey(accountId!);
      const res = await getSecret(tokenKey);

      return typeof res === 'string' ? res : null;
    },
    refetchOnMount: true,
    enabled: isAccountIdLoaded,
    retry: false,
  });

  return {
    githubToken: data,
    githubTokenErrorMessage: error?.message,
    isGithubTokenLoading: isLoading || isFetching,
  };
}

export default useGithub;
