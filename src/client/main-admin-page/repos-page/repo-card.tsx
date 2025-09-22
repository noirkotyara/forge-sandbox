import {
  Box,
  Button,
  Heading,
  Inline,
  Lozenge,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  ModalTransition,
  Stack,
  Text,
  xcss,
} from '@forge/react';
import GithubRepo from '../../../types/GithubRepo.interface';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getGithubLinkedPRs } from '../../../../ui/services';
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
}

function RepoCard(props: RepoCardProps) {
  const { repo } = props;
  const [isOpen, setIsOpen] = useState(false);

  const { data, isLoading } = useQuery<LinkedPR[]>({
    queryKey: ['github', 'linkedPRs', repo.id],
    queryFn: async () => getGithubLinkedPRs(repo.full_name),
    enabled: isOpen,
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
              <ModalTitle>Duplicate this page</ModalTitle>
            </ModalHeader>
            <ModalBody>
              {data?.length === 0 && <Text>No linked PRs</Text>}
              {isLoading && <Box>Loading...</Box>}
              {data && data.length > 0 && (
                <Box>
                  {data.map((linkedPR) => (
                    <Inline key={linkedPR.pr.id} space="space.200" alignBlock="center">
                      <Text>{linkedPR.pr.title}</Text>
                      <Lozenge>{linkedPR.jiraIssue.fields.status.name}</Lozenge>
                    </Inline>
                  ))}
                </Box>
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
