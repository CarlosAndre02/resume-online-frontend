import {
  AccordionButton, AccordionItem, AccordionPanel, Box,
  Button,
  Flex,
  FormControl, FormErrorMessage, FormLabel, Textarea, useToast,
} from '@chakra-ui/react';
import { Minus, Plus } from 'phosphor-react';
import { FormEvent, useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import axios from '../../services/axios';

type OnSubmitEvent = FormEvent<HTMLFormElement> & {
  currentTarget: {
    description: HTMLInputElement
  };
};

export function ProfileSection() {
  const [description, setDescription] = useState('');
  const [descriptionError, setDescriptionError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const toast = useToast();

  const validateForm = (descriptionField: string) => {
    if (descriptionField.length < 5) {
      return 'Descrição inválida';
    }
    return '';
  };

  const handleSubmit = async (event: OnSubmitEvent) => {
    event.preventDefault();

    const descriptionField = event.currentTarget.description.value.trim();

    const error = validateForm(descriptionField);
    setDescriptionError(error);
    if (error) return;

    try {
      setIsLoading(true);

      const response = await axios.put(`/resumes/${user?.username}/abouts`, {
        description: descriptionField,
      });
      setDescription(response.data.description);
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
        const response = await axios.get(`/resumes/${user?.username}/abouts`);
        setDescription(response.data.description);
      } catch (e) {
        setDescription('');
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
              mt="3"
              border="2px"
              borderColor="black"
              bg="white"
              _focus={{ borderColor: 'black' }}
            >
              <Box flex="1" textAlign="left" fontSize="xl">
                Perfil pessoal
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
              <FormControl isInvalid={!!descriptionError} isRequired mb="4">
                <FormLabel htmlFor="description">Descrição</FormLabel>
                <Textarea
                  id="description"
                  name="description"
                  bg="white"
                  border="2px"
                  borderColor="brand.100"
                  resize="none"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  _hover={{ borderColor: 'brand.300' }}
                />
                <FormErrorMessage>{descriptionError}</FormErrorMessage>
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
