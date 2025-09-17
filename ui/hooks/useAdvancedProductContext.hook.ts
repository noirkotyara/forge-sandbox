import { useProductContext } from '@forge/react';
import ProductContext from '../types/ProductContext.interface';
import { useMemo } from 'react';

function useAdvancedProductContext() {
  const productContext = useProductContext() as ProductContext;

  const isAccountIdLoaded = useMemo(() => {
    return typeof productContext?.accountId === 'string';
  }, [productContext?.accountId]);

  return {
    ...productContext,
    isAccountIdLoaded,
  };
}

export default useAdvancedProductContext;
