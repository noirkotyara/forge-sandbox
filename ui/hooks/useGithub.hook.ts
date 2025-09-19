import { useEffect, useState } from 'react';
import { generateUserGithubTokenKey } from '../../src/services/secret-storage';
import { getSecret } from '../services';
import useAdvancedProductContext from './useAdvancedProductContext.hook';

function useGithub() {
  const { isAccountIdLoaded, accountId } = useAdvancedProductContext();
  const [githubToken, setGithubToken] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isAccountIdLoaded) {
      const tokenKey = generateUserGithubTokenKey(accountId!);
      getSecret(tokenKey)
        .then((token) => {
          if (typeof token === 'string') {
            setGithubToken(token as string);
          } else {
            setGithubToken(null);
          }
        })
        .catch(() => {
          setErrorMessage('Error getting Github Token');
        });
    }
  }, [isAccountIdLoaded]);

  return {
    githubToken,
    githubTokenErrorMessage: errorMessage,
  };
}

export default useGithub;
