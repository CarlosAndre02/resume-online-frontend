import {
  AccordionButton, AccordionItem, AccordionPanel, useToast,
  Box, Button, Flex, FormControl, FormErrorMessage, FormLabel, Input,
} from '@chakra-ui/react';
import { Minus, Plus } from 'phosphor-react';
import { FormEvent, useEffect, useState } from 'react';
import validator from 'validator';
import { useAuth } from '../../hooks/useAuth';
import axios from '../../services/axios';
import { PhotoUpload } from '../../components/PhotoUpload';

type OnSubmitEvent = FormEvent<HTMLFormElement> & {
  currentTarget: {
    name: HTMLInputElement
    position: HTMLInputElement
    phone_number: HTMLInputElement
    address: HTMLInputElement
    email: HTMLInputElement
    website: HTMLInputElement
    linkedin_link: HTMLInputElement
    github_link: HTMLInputElement
  };
};

type FormFields = {
  name: string
  position: string
  phone_number: string
  address: string
  email: string
  website: string
  linkedin_link: string
  github_link: string
}

export function PersonalInformationSection() {
  const [fieldValues, setFieldValues] = useState({} as FormFields);
  const [errors, setErrors] = useState({
    nameError: '',
    positionError: '',
    phone_numberError: '',
    addressError: '',
    emailError: '',
    websiteError: '',
    linkedin_link_error: '',
    github_link_error: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const toast = useToast();

  const validateForm = (fields: FormFields) => {
    const fieldErrors = {
      nameError: '',
      positionError: '',
      phone_numberError: '',
      addressError: '',
      emailError: '',
      websiteError: '',
      linkedin_link_error: '',
      github_link_error: '',
    };
    let isThereError = false;

    if (fields.name.length < 3) {
      fieldErrors.nameError = 'Nome precisa ter pelo menos 3 caracteres';
      isThereError = true;
    }

    if (fields.position.length < 3) {
      fieldErrors.positionError = 'Profissão precisa ter pelo menos 3 caracteres';
      isThereError = true;
    }

    if (fields.phone_number.length < 6) {
      fieldErrors.phone_numberError = 'Telefone precisa ter pelo menos 6 caracteres';
      isThereError = true;
    }

    if (fields.address.length < 3) {
      fieldErrors.addressError = 'Endereço precisa ter pelo menos 3 caracteres';
      isThereError = true;
    }

    if (!validator.isEmail(fields.email)) {
      fieldErrors.emailError = 'Email inválido';
      isThereError = true;
    }

    if (fields.website && !validator.isURL(fields.website)) {
      fieldErrors.websiteError = 'Link inválido';
      isThereError = true;
    }

    if (fields.linkedin_link && !validator.isURL(fields.linkedin_link)) {
      fieldErrors.linkedin_link_error = 'Link inválido';
      isThereError = true;
    }

    if (fields.github_link && !validator.isURL(fields.github_link)) {
      fieldErrors.github_link_error = 'Link inválido';
      isThereError = true;
    }

    return { ...fieldErrors, isThereError };
  };

  const handleSubmit = async (event: OnSubmitEvent) => {
    event.preventDefault();

    const name = event.currentTarget.name.value.trim();
    const position = event.currentTarget.position.value.trim();
    const phoneNumber = event.currentTarget.phone_number.value.trim();
    const address = event.currentTarget.address.value.trim();
    const email = event.currentTarget.email.value.trim();
    const website = event.currentTarget.website.value.trim();
    const linkedinLink = event.currentTarget.linkedin_link.value.trim();
    const githubLink = event.currentTarget.github_link.value.trim();

    const { isThereError, ...errorsValidated } = validateForm({
      name,
      position,
      address,
      email,
      website,
      phone_number: phoneNumber,
      linkedin_link: linkedinLink,
      github_link: githubLink,
    });
    setErrors(errorsValidated);

    if (isThereError) return;

    try {
      setIsLoading(true);

      const response = await axios.put(`/resumes/${user?.username}/profiles`, {
        name,
        position,
        phone_number: phoneNumber,
        address,
        email,
        website: website || null,
        linkedin_link: linkedinLink || null,
        github_link: githubLink || null,
      });

      setFieldValues(response.data.description);
      toast({
        title: 'Informações salvas.',
        status: 'success',
        duration: 4000,
        isClosable: true,
      });
    } catch (e) {
      toast({
        title: 'Ocorreu um erro. Tente novamente.',
        status: 'error',
        duration: 4000,
        isClosable: true,
      });
    }
    setIsLoading(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`/resumes/${user?.username}/profiles`);
        setFieldValues(response.data);
      } catch (e) {
        setFieldValues({
          name: '',
          position: '',
          phone_number: '',
          address: '',
          email: '',
          website: '',
          linkedin_link: '',
          github_link: '',
        });
      }
    };
    fetchData();
  }, []);

  return (
    <AccordionItem>
      {({ isExpanded }) => (
        <>
          <h3>
            <AccordionButton
              border="2px"
              borderColor="black"
              bg="white"
              _focus={{ borderColor: 'black' }}
            >
              <Box flex="1" textAlign="left" fontSize="xl">
                Informações pessoais
              </Box>
              {isExpanded ? (
                <Minus size={24} color="#030303" weight="bold" />
              ) : (
                <Plus size={24} color="#030303" weight="bold" />
              )}
            </AccordionButton>
          </h3>
          <AccordionPanel p={7} bg="white" border="2px" borderTop={0} borderColor="black">
            <form onSubmit={handleSubmit}>
              <PhotoUpload />
              <FormControl isInvalid={!!errors.nameError} isRequired>
                <FormLabel htmlFor="name">Nome completo</FormLabel>
                <Input
                  id="name"
                  type="text"
                  name="name"
                  bg="white"
                  border="2px"
                  borderColor="brand.100"
                  value={fieldValues.name}
                  onChange={(e) => setFieldValues((old) => ({ ...old, name: e.target.value }))}
                  _hover={{ borderColor: 'brand.300' }}
                />
                <FormErrorMessage>{errors.nameError}</FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={!!errors.positionError} isRequired my="4">
                <FormLabel htmlFor="position">Profissão</FormLabel>
                <Input
                  id="position"
                  type="text"
                  name="position"
                  bg="white"
                  border="2px"
                  borderColor="brand.100"
                  value={fieldValues.position}
                  onChange={(e) => setFieldValues((old) => ({ ...old, position: e.target.value }))}
                  _hover={{ borderColor: 'brand.300' }}
                />
                <FormErrorMessage>{errors.positionError}</FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={!!errors.phone_numberError} isRequired my="4">
                <FormLabel htmlFor="phone_number">Telefone</FormLabel>
                <Input
                  id="phone_number"
                  type="text"
                  name="phone_number"
                  bg="white"
                  border="2px"
                  borderColor="brand.100"
                  value={fieldValues.phone_number}
                  onChange={(e) => setFieldValues((old) => (
                    { ...old, phone_number: e.target.value }))}
                  _hover={{ borderColor: 'brand.300' }}
                />
                <FormErrorMessage>{errors.phone_numberError}</FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={!!errors.addressError} isRequired my="4">
                <FormLabel htmlFor="address">Endereço</FormLabel>
                <Input
                  id="address"
                  type="text"
                  name="address"
                  bg="white"
                  border="2px"
                  borderColor="brand.100"
                  value={fieldValues.address}
                  onChange={(e) => setFieldValues((old) => ({ ...old, address: e.target.value }))}
                  _hover={{ borderColor: 'brand.300' }}
                />
                <FormErrorMessage>{errors.addressError}</FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={!!errors.emailError} isRequired my="4">
                <FormLabel htmlFor="email">Email</FormLabel>
                <Input
                  id="email"
                  type="email"
                  name="email"
                  bg="white"
                  border="2px"
                  borderColor="brand.100"
                  value={fieldValues.email}
                  onChange={(e) => setFieldValues((old) => ({ ...old, email: e.target.value }))}
                  _hover={{ borderColor: 'brand.300' }}
                />
                <FormErrorMessage>{errors.emailError}</FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={!!errors.websiteError} my="4">
                <FormLabel htmlFor="website">Link site pessoal</FormLabel>
                <Input
                  id="website"
                  type="text"
                  name="website"
                  bg="white"
                  border="2px"
                  borderColor="brand.100"
                  value={fieldValues.website || ''}
                  onChange={(e) => setFieldValues((old) => ({ ...old, website: e.target.value }))}
                  _hover={{ borderColor: 'brand.300' }}
                />
                <FormErrorMessage>{errors.websiteError}</FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={!!errors.linkedin_link_error} my="4">
                <FormLabel htmlFor="linkedin_link">Link Linkedin</FormLabel>
                <Input
                  id="linkedin_link"
                  type="text"
                  name="linkedin_link"
                  bg="white"
                  border="2px"
                  borderColor="brand.100"
                  value={fieldValues.linkedin_link || ''}
                  onChange={(e) => setFieldValues((old) => (
                    { ...old, linkedin_link: e.target.value }))}
                  _hover={{ borderColor: 'brand.300' }}
                />
                <FormErrorMessage>{errors.linkedin_link_error}</FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={!!errors.github_link_error} mb="4">
                <FormLabel htmlFor="github_link">Link Github</FormLabel>
                <Input
                  id="github_link"
                  type="text"
                  name="github_link"
                  bg="white"
                  border="2px"
                  borderColor="brand.100"
                  value={fieldValues.github_link || ''}
                  onChange={(e) => setFieldValues((old) => (
                    { ...old, github_link: e.target.value }))}
                  _hover={{ borderColor: 'brand.300' }}
                />
                <FormErrorMessage>{errors.github_link_error}</FormErrorMessage>
              </FormControl>
              <Flex justify="flex-end">
                <Button
                  type="submit"
                  size="md"
                  bg="brand.500"
                  color="white"
                  isLoading={isLoading}
                  _hover={{ bg: 'brand.700' }}
                >
                  Salvar
                </Button>
              </Flex>
            </form>
          </AccordionPanel>
        </>
      )}
    </AccordionItem>
  );
}
