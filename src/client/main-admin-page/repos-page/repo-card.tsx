import {
  Box,
  Button,
  Heading,
  Inline,
  Link,
  Lozenge,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  ModalTransition,
  SectionMessage,
  Stack,
  Text,
  xcss,
} from '@forge/react';
import GithubRepo from '../../../types/GithubRepo.interface';
import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getGithubLinkedPRs, mergeGithubRepoPullRequest } from '../../../../ui/services';
import LinkedPR from '../../../types/LinkedPR.interface';

const textStyle = xcss({
  color: 'color.text',
  marginBottom: 'space.100',
});

const cardStyle = xcss({
  backgroundColor: 'elevation.surface',
  padding: 'space.200',
  borderColor: 'color.border',
  borderWidth: 'border.width',
  borderStyle: 'solid',
  borderRadius: 'border.radius',
  ':hover': {
    backgroundColor: 'elevation.surface.hovered',
  },
});
interface RepoCardProps {
  repo: GithubRepo;
  githubToken: string;
}

function RepoCard(props: RepoCardProps) {
  const { repo, githubToken } = props;
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery<LinkedPR[]>({
    queryKey: ['github', 'linkedPRs', repo.id],
    queryFn: async () => getGithubLinkedPRs(repo.full_name),
    enabled: isOpen,
  });

  const {
    mutate: mergePR,
    error: mergePRError,
    isPending: isMergePRPending,
  } = useMutation<void, Error, { repoFullName: string; prNumber: number }>({
    mutationFn: async ({ repoFullName, prNumber }) =>
      await mergeGithubRepoPullRequest(githubToken, repoFullName, prNumber),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['github', 'linkedPRs', repo.id] });
    },
  });

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  return (
    <Box xcss={cardStyle}>
      <Stack space="space.100" alignInline="start">
        <Heading as="h3">{repo.name}</Heading>
        <Box xcss={textStyle}>{repo.language || 'No language'}</Box>
        <Button appearance="primary" onClick={openModal}>
          LoadLinked PRs
        </Button>
      </Stack>

      <ModalTransition>
        {isOpen && (
          <Modal onClose={closeModal}>
            <ModalHeader>
              <ModalTitle>Linked PRs</ModalTitle>
            </ModalHeader>
            <ModalBody>
              {isLoading || isMergePRPending ? (
                <Box>Loading...</Box>
              ) : !data?.length ? (
                <Text>No linked PRs</Text>
              ) : (
                <Box>
                  {data.map((linkedPR) => {
                    return (
                      <Inline key={linkedPR.pr.id} space="space.200" alignBlock="center">
                        <Text>{linkedPR.pr.title}</Text>
                        <Lozenge>{linkedPR.jiraIssue.fields.status.name}</Lozenge>
                        <Link href={linkedPR.pr._links.html.href}>Open PR</Link>
                        <Button
                          appearance="primary"
                          onClick={() =>
                            mergePR({
                              repoFullName: linkedPR.pr.base.repo.full_name,
                              prNumber: linkedPR.pr.number,
                            })
                          }
                          isDisabled={isMergePRPending}
                        >
                          Merge PR
                        </Button>
                      </Inline>
                    );
                  })}
                </Box>
              )}
              {mergePRError && (
                <SectionMessage appearance="error">{mergePRError.message}</SectionMessage>
              )}
            </ModalBody>
            <ModalFooter>
              <Button appearance="subtle" onClick={closeModal}>
                Close
              </Button>
            </ModalFooter>
          </Modal>
        )}
      </ModalTransition>
    </Box>
  );
}

export default RepoCard;
