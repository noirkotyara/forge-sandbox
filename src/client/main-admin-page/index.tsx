import React from 'react';
import ForgeReconciler, { Box } from '@forge/react';
import { Router, Route, Routes } from 'react-router';
import ReposPage from './repos-page';
import AuthPage from './auth-page';
import useRouting from '../../../ui/hooks/useRouting.hook';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const App = () => {
  const { historyState, navigator } = useRouting();

  if (!navigator || !historyState) {
    return <Box>Loading...</Box>;
  }

  return (
    <Box>
      <Router
        navigator={navigator}
        navigationType={historyState.action as never}
        location={historyState.location}
      >
        <Routes>
          <Route path="/auth" element={<AuthPage />}></Route>
          <Route path="/repos" element={<ReposPage />}></Route>
        </Routes>
      </Router>
    </Box>
  );
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
  },
});

ForgeReconciler.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>,
);
