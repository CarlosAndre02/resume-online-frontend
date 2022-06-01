import {
  Accordion, Button, Container, Flex, Heading,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

import { Header } from '../../components/Header';
import { PersonalInformationSection } from './PersonalInformationSection';
import { ProfileSection } from './ProfileSection';
import { WorkExperienceSection } from './WorkExperienceSection';
import { EducationSection } from './EducationSection';
import { SkillSection } from './SkillSection';

export function EditResume() {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <Container maxW="870px" pb="8">
      <Header />

      <Flex align="center" justify="space-between" my={8}>
        <Heading as="h2">Meu Currículo</Heading>
        <Button
          size="md"
          bg="brand.500"
          color="white"
          _hover={{ bg: 'brand.700' }}
          onClick={() => navigate(`/${user?.username}`)}
        >
          Visualizar currículo
        </Button>
      </Flex>

      <Accordion allowMultiple>
        <PersonalInformationSection />
        <ProfileSection />
        <WorkExperienceSection />
        <EducationSection />
        <SkillSection />
      </Accordion>
    </Container>
  );
}
