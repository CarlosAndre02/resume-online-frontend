import {
  Accordion, Button, Container, Heading, Text,
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
  const { user, logOutUser } = useAuth();
  const navigate = useNavigate();

  return (
    <Container maxW="870px" pb="8">
      <Header />
      <Heading as="h2" my={8}>Meu Currículo</Heading>

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
