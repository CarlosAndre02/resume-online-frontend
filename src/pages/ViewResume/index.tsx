import {
  Avatar,
  Box, Center, Container, Flex, Heading, Link, ListItem, Text, UnorderedList,
} from '@chakra-ui/react';
import {
  EnvelopeOpen, GithubLogo, Laptop, LinkedinLogo, MapPin, Phone,
} from 'phosphor-react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import moment from 'moment';

import { Header } from '../../components/Header';
import axios from '../../services/axios';

import { WorkExperience } from '../EditResume/WorkExperienceSection';
import { Skill } from '../EditResume/SkillSection';
import { Education } from '../EditResume/EducationSection';

type Resume = {
  Profile: {
    name: string
    position: string
    phone_number: string
    address: string
    email: string
    website: string
    linkedin_link: string
    github_link: string
    Photo: {
      filename: string
      originalname: string
      url: string
    }
  }
  About: {
    description: string
  }
  Education: Education[]
  Experiences: WorkExperience[]
  Skills: Skill[]
}

export function ViewResume() {
  const [resume, setResume] = useState<Resume | null>();
  const { username } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`/resumes/${username}`);
        setResume(response.data);
      } catch (e) {
        setResume(null);
      }
    };
    fetchData();
  }, []);

  return (
    <Container maxW="870px" pb="8">
      <Header />

      { (!!resume && !!resume?.Profile && !!resume?.About) ? (
        <Box mt="8" boxShadow="xl">
          <Flex pos="relative" direction={{ base: 'column', md: 'row' }}>
            <Flex w={{ base: '100%', md: '35%' }} bg="#335384" p="50px" textAlign={{ base: 'center', md: 'start' }} align={{ base: 'center', md: 'normal' }} justify={{ base: 'center', md: 'normal' }} direction="column">
              { !!resume?.Profile.Photo && (
                <Box>
                  <Avatar w={{ base: '15rem', md: '12rem' }} h={{ base: '15rem', md: '12rem' }} src={resume?.Profile.Photo.url} mb={{ base: '80px', md: '0' }} />
                </Box>
              )}
              <Box pos={{ base: 'static', md: 'absolute' }} top="70px" left="340px" textAlign={{ base: 'center', md: 'start' }} mr={{ md: '60px' }}>
                <Heading as="h1" size="xl" color={{ base: '#ffffff', md: '#335384' }} mb="5" wordBreak="break-word">{resume?.Profile.name}</Heading>
                <Text fontSize="2xl" color={{ base: '#ffffff', md: '#5BA7D1' }} wordBreak="break-word">{resume?.Profile.position}</Text>
              </Box>
              <Box my="65px" color="white">
                <Heading as="h2" size="xs" letterSpacing="2px" mb="5">CONTATO</Heading>
                <Flex>
                  <MapPin size={20} color="#ffffff" weight="fill" />
                  <Text w="100%" fontSize="xs" ml="4" wordBreak="break-word">{resume?.Profile.address}</Text>
                </Flex>
                <Flex my="5">
                  <Phone size={20} color="#ffffff" />
                  <Text w="100%" fontSize="xs" ml="4" wordBreak="break-word">{resume?.Profile.phone_number}</Text>
                </Flex>
                <Flex>
                  <EnvelopeOpen size={20} color="#ffffff" weight="fill" />
                  <Text w="100%" fontSize="xs" ml="4" wordBreak="break-word">{resume?.Profile.email}</Text>
                </Flex>
                { !!resume?.Profile.website && (
                  <Flex mt="5">
                    <Laptop size={20} color="#ffffff" />
                    <Link href={resume?.Profile.website} isExternal w="100%" fontSize="xs" ml="4" wordBreak="break-word">
                      {resume?.Profile.website}
                    </Link>
                  </Flex>
                )}
                { !!resume?.Profile.linkedin_link && (
                  <Flex mt="5">
                    <LinkedinLogo size={20} color="#ffffff" />
                    <Link href={resume?.Profile.linkedin_link} isExternal w="100%" fontSize="xs" ml="4" wordBreak="break-word">
                      @LinkedIn
                    </Link>
                  </Flex>
                )}
                { !!resume?.Profile.github_link && (
                  <Flex mt="5">
                    <GithubLogo size={20} color="#ffffff" />
                    <Link href={resume?.Profile.github_link} isExternal w="100%" fontSize="xs" ml="4" wordBreak="break-word">
                      @Github
                    </Link>
                  </Flex>
                )}
              </Box>
              { (!!resume?.Skills && resume?.Skills.length > 0) && (
                <Box>
                  <Heading as="h2" color="white" size="xs" letterSpacing="2px" mb="5">HABILIDADES</Heading>
                  <UnorderedList fontSize="sm" color="white">
                    {resume?.Skills.map((skill) => (<ListItem key={skill.id} mb="3">{skill.skill}</ListItem>))}
                  </UnorderedList>
                </Box>
              )}
            </Flex>

            <Box w={{ base: '100%', md: '65%' }} bg="white" p="47px">
              <Box mt={{ base: '0', md: '260px' }}>
                <Heading as="h2" color="#5BA7D1" size="xs" letterSpacing="2px" mb="3">PERFIL PESSOAL</Heading>
                <Text fontSize="sm">
                  {resume?.About.description}
                </Text>
              </Box>
              { (!!resume?.Experiences && resume.Experiences.length > 0) && (
                <Box mt="50px">
                  <Heading as="h2" color="#5BA7D1" size="xs" letterSpacing="2px">EXPERIÊNCIA DE TRABALHO</Heading>
                  {resume?.Experiences.map((experience) => (
                    <Box key={experience.id} mt="4">
                      <Heading as="h3" size="sm" fontWeight="medium">{experience.position}</Heading>
                      <Text fontSize="xs" color="#A7A49E" mt="1">{`${experience.company} | ${moment(experience.start_date).format('MM/YYYY')} - ${moment(experience.end_date).format('MM/YYYY')}`}</Text>
                      <Text fontSize="sm" mt="2">
                        {experience.description}
                      </Text>
                    </Box>
                  ))}
                </Box>
              )}
              { (!!resume?.Education && resume?.Education.length > 0) && (
                <Box mt="50px">
                  <Heading as="h2" color="#5BA7D1" size="xs" letterSpacing="2px">HISTÓRICO ACADÊMICO</Heading>
                  {resume?.Education.map((education) => (
                    <Box key={education.id} mt="4">
                      <Heading as="h3" size="sm" fontWeight="medium">{education.school}</Heading>
                      <Text fontSize="xs" color="#A7A49E" mt="1">{`${education.degree} | ${moment(education.start_date).format('MM/YYYY')} - ${moment(education.end_date).format('MM/YYYY')}`}</Text>
                      <Text fontSize="sm" mt="2">
                        {education.description}
                      </Text>
                    </Box>
                  ))}
                </Box>
              )}
            </Box>
          </Flex>
        </Box>
      ) : (
        <Center mx="auto" height="82vh" maxWidth="350px" color="brand.500" fontSize="xl" textAlign="center">
          Esse usuário não tem um currículo
        </Center>
      )}
    </Container>
  );
}
