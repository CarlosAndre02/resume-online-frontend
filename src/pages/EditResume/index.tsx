import {
  Accordion, Button, Container, Heading, Text,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

import { Header } from '../../components/Header';
import { PersonalInformationSection } from './PersonalInformationSection';
import { ProfileSection } from './ProfileSection';
import { WorkExperienceSection } from './WorkExperienceSection';

export function EditResume() {
  const { user, logOutUser } = useAuth();
  const navigate = useNavigate();

  return (
    <Container maxW="870px">
      <Header />
      <Heading as="h2" my={8}>Meu Currículo</Heading>

      <Accordion allowMultiple>
        <PersonalInformationSection />
        <ProfileSection />
        <WorkExperienceSection />
      </Accordion>

      <Text>
        token
        {' '}
        {user?.token}
      </Text>
      <Text>
        id
        {' '}
        {user?.id}
      </Text>
      <Text>
        username
        {' '}
        {user?.username}
      </Text>
      <Button onClick={() => {
        logOutUser();
        navigate('/');
      }}
      >
        Deslogar
      </Button>
    </Container>
  );
}
